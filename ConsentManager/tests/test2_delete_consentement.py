# Retrait du consentement
payload_remove = {
    "idRef": USER_ID,
    "consent": False
}

response_remove = requests.post(f"{BASE_URL}/dataAccessRight", json=payload_remove)

if response_remove.status_code == 200:
    print("✅ Consentement retiré avec succès !")

    # Vérification : TeaStore peut-il encore récupérer des données ?
    response_data = requests.get(f"{BASE_URL}/dataValue", params={"idRef": USER_ID, "dataName": "email"})

    if response_data.status_code == 403:
        print("✅ TeaStore respecte bien le retrait du consentement !")
    else:
        print("❌ TeaStore accède encore aux données après retrait du consentement.")
else:
    print("❌ Échec du retrait du consentement :", response_remove.text)
