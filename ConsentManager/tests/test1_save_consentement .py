import requests

# Configuration
BASE_URL = "http://localhost:8086/api"
USER_ID = "1"

# Envoi du consentement
payload = {
    "idRef": USER_ID,
    "consent": True
}

response = requests.post(f"{BASE_URL}/dataAccessRight", json=payload)

if response.status_code == 200:
    print("✅ Consentement enregistré avec succès !")
else:
    print("❌ Échec de l'enregistrement du consentement :", response.text)
