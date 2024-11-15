# IDUPPA

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python Version](https://img.shields.io/badge/python-%3E%3D3.9-brightgreen.svg)
![MySQL Version](https://img.shields.io/badge/mysql-%3E%3D8.0-orange.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-success.svg)

## 🚀 Installation sécurisée

1. **Cloner le dépôt**
```bash
git clone https://github.com/IDUPPA/IDUPPA.git
cd IDUPPA
```
2. **Installation des dépendances Node.js**
```bash
cd WEB
npm ci
npm audit
```
3. **Installation des dépendances Python**
```bash
cd ../SCRIPT
# Installer les dépendances depuis requirements.txt
pip install -r requirements.txt
# Vérifier les vulnérabilités connues
pip-audit
```

4. **Configuration de la base de données**
Pour commencer, il faut créer la base de données de départ avec le script `createDB.sql`, puis on crée les bases de données de la solution avec le script `createDBs.sql`, puis on initialise les données de test avec le script `createDATA.sql`

## 📜 Scripts et Outils

### Scripts Python (répertoire SCRIPT/)

Le répertoire `SCRIPT/` contient les outils d'anonymisation et de traitement sécurisé des données :

```
SCRIPT/
├── requirements.txt          # Dépendances Python
├── DATA/
│   ├── noms.txt            # Dictionnaire pour l'anonymisation
│   └── prenoms.txt         # Dictionnaire pour l'anonymisation
├── StartClient/
│   └── createDB.sql        # Création de la base client
└── StartSolution/
    ├── IDUPPA.py           # Script principal d'anonymisation
    ├── createDATA.sql      # Initialisation des données
    ├── createDBs.sql       # Création des bases
    └── db_config.cnf.ini   # Configuration base de données
```

1. **Exécution du script d'anonymisation**
   
Ce script permet d'anonymiser des données sensibles en utilisant des dictionnaires de noms et prénoms.
```bash
python StartSolution/IDUPPA.py
```