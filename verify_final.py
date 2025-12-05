import time
from playwright.sync_api import sync_playwright

def verify_final():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Helper to login
        def login():
            page.goto("http://localhost:5173/login")
            page.fill("input[type='text']", "admin")
            page.fill("input[type='password']", "admin")
            page.click("button[type='submit']")
            page.wait_for_url("**/dashboard")
            print("Login successful")

        try:
            login()

            # 1. Verify Service Measurement Report
            print("Verifying Service Measurement Report...")
            page.goto("http://localhost:5173/medicao-servico")
            page.wait_for_selector("h1:has-text('Boletim de Medição de Serviço (BMS)')", timeout=5000)
            print(" - BMS Page Loaded")

            # 2. Verify RDO (List + New Button)
            print("Verifying RDO...")
            page.goto("http://localhost:5173/rdo")
            page.wait_for_selector("h1:has-text('Relatórios Diários de Obra (RDO)')", timeout=5000)
            # Check for New Button
            if page.is_visible("button:has-text('Novo RDO')"):
                print(" - 'Novo RDO' button found")
                page.click("button:has-text('Novo RDO')")
                page.wait_for_selector("h2:has-text('Novo Relatório Diário de Obra')", timeout=2000)
                print(" - New RDO Modal opened")
                page.click("button:has-text('Cancelar')")
            else:
                print(" - 'Novo RDO' button NOT found")

            # 3. Verify Stock Movement Form
            print("Verifying Stock Movement Form...")
            page.goto("http://localhost:5173/movimentacao-estoque")
            page.wait_for_selector("h1:has-text('Movimentação de Estoque')", timeout=5000)
            print(" - Stock Movement Form Loaded")

            # 4. Verify Stock Transfers
            print("Verifying Stock Transfers...")
            page.goto("http://localhost:5173/transferencias-estoque")
            page.wait_for_selector("h1:has-text('Movimentações de Estoque')", timeout=5000)
            print(" - Stock Transfers List Loaded")

            print("ALL CHECKS PASSED")

        except Exception as e:
            print(f"VERIFICATION FAILED: {e}")
            page.screenshot(path="verification_failure.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_final()
