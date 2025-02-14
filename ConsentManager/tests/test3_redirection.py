from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("http://localhost:8080")

try:
    button = driver.find_element(By.CLASS_NAME, "button-23")
    button.click()

    expected_url = "http://localhost:8086/privacy-management"
    if driver.current_url == expected_url:
        print("✅ Redirection réussie vers Privacy Rights !")
    else:
        print(f"❌ Mauvaise redirection : {driver.current_url}")
finally:
    driver.quit()