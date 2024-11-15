from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP, ForeignKey, SmallInteger
from sqlalchemy.orm import sessionmaker, declarative_base
import datetime
from dotenv import load_dotenv
import os
import random

Base = declarative_base()

# Définition des classe de tables
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(100))
    first_name = Column(String(100))
    last_name = Column(String(100))
    date_of_birth = Column(Date)
    city = Column(String(100))
    country = Column(String(100))
    sex = Column(String(10))
    profession = Column(String(100))
    role_id = Column(Integer)
    data_access_level = Column(SmallInteger)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

class PseudonymizedData(Base):
    __tablename__ = 'pseudonymized_data'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    pseudonymized_name = Column(String(100))
    pseudonymized_firstname = Column(String(100))
    pseudonymized_email = Column(String(100))
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

class DynamicAccessControl(Base):
    __tablename__ = 'dynamic_access_control'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    data_access_level = Column(SmallInteger)
    context_info = Column(Text)
    valid_from = Column(TIMESTAMP)
    valid_to = Column(TIMESTAMP)

load_dotenv()

# Configuration de la base de données
DATABASE_URL_USERS = os.getenv('DATABASE_URL_USERS').replace("mysql://", "mysql+pymysql://")
DATABASE_URL_PSEUDONYMIZED = os.getenv('DATABASE_URL_PSEUDONYMIZED').replace("mysql://", "mysql+pymysql://")
DATABASE_URL_ACCESS_CONTROL = os.getenv('DATABASE_URL_ACCESS_CONTROL').replace("mysql://", "mysql+pymysql://")

engine_users = create_engine(DATABASE_URL_USERS)
engine_pseudonymized = create_engine(DATABASE_URL_PSEUDONYMIZED)
engine_access_control = create_engine(DATABASE_URL_ACCESS_CONTROL)

SessionUsers = sessionmaker(bind=engine_users)
SessionPseudonymized = sessionmaker(bind=engine_pseudonymized)
SessionAccessControl = sessionmaker(bind=engine_access_control)

# Charger les noms et prénoms depuis les fichiers
def load_names(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return [line.strip() for line in file.readlines()]

# Charger les fichiers de noms et prénoms
noms = load_names('./DATA/noms.txt')
prenoms = load_names('./DATA/prenoms.txt')

# Générer un email sous le format "prenom.nom@email.fr"
def generate_email(prenom, nom):
    nom_clean = nom.replace(' ', '_')  # Remplacer les espaces par des underscores
    return f"{prenom.lower()}.{nom_clean.lower()}@email.fr"

# Pseudonymisation des données et insertion dans la table Pseudonymized_Data
def pseudonymize_data():
    with SessionUsers() as session_users, SessionPseudonymized() as session_pseudo:
        users = session_users.query(User).all()
        for user in users:
            # Sélectionner un prénom et un nom aléatoires
            nom = random.choice(noms)
            prenom = random.choice(prenoms)
            email = generate_email(prenom, nom)

            # Remplacer les données réelles par les valeurs pseudonymisées
            pseudo_data = PseudonymizedData(
                user_id=user.id,
                pseudonymized_name=nom,
                pseudonymized_firstname=prenom,
                pseudonymized_email=email
            )
            session_pseudo.add(pseudo_data)

            # Mettre à jour l'email pseudonymisé dans la table Users
            user.email = email
        session_pseudo.commit()

# Vérification et mise à jour des entrées dans Dynamic_Access_Control
def check_and_update_access_control():
    today = datetime.datetime.now(datetime.UTC)
    valid_to_date = today + datetime.timedelta(days=30)
    with SessionUsers() as session_users, SessionAccessControl() as session_access:
        users = session_users.query(User).all()
        for user in users:
            access_control_entry = session_access.query(DynamicAccessControl).filter_by(user_id=user.id).first()
            if not access_control_entry:
                new_entry = DynamicAccessControl(
                    user_id=user.id,
                    data_access_level=user.data_access_level,
                    context_info="normal",
                    valid_from=today,
                    valid_to=valid_to_date
                )
                session_access.add(new_entry)
        session_access.commit()

# Exécution des fonctions
pseudonymize_data()
check_and_update_access_control()
