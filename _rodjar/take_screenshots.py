"""
Screenshot script for Anílog design audit v5.
Captures all four tabs on the Expo web dev server.
"""
from playwright.sync_api import sync_playwright
import os, time

OUT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
BASE_URL = "http://localhost:8083"

def take_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},   # iPhone 14 dims
            device_scale_factor=2,
        )
        page = ctx.new_page()

        print("[1/4] Loading Party tab …")
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle", timeout=30000)
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "01-party-tab.png"), full_page=True)
        print("      -> 01-party-tab.png saved")

        # Navigate directly via URL (expo-router)
        print("[2/4] Navigating to Collection tab …")
        page.goto(BASE_URL + "/(tabs)/anilog")
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "02-collection-tab.png"), full_page=True)
        print("      -> 02-collection-tab.png saved")

        print("[3/4] Navigating to Logbook tab …")
        page.goto(BASE_URL + "/(tabs)/logbook")
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "03-logbook-tab.png"), full_page=True)
        print("      -> 03-logbook-tab.png saved")

        print("[4/4] Navigating to Profile tab …")
        page.goto(BASE_URL + "/(tabs)/profile")
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "04-profile-tab.png"), full_page=True)
        print("      -> 04-profile-tab.png saved")

        # Also screenshot the onboarding route
        print("[5/5] Checking onboarding …")
        page.goto(BASE_URL + "/onboarding")
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(2)
        page.screenshot(path=os.path.join(OUT_DIR, "05-onboarding.png"), full_page=True)
        print("      -> 05-onboarding.png saved")

        browser.close()

if __name__ == "__main__":
    take_screenshots()
    print("All screenshots saved to", OUT_DIR)
