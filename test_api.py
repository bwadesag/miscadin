"""Test script to verify API and database access."""
import requests
import json

def test_api():
    base_url = "http://localhost:5000/api"
    
    print("🔍 Test de l'API Flask...\n")
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✓ Health check: OK")
            print(f"  Réponse: {response.json()}\n")
        else:
            print(f"✗ Health check: Code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Backend non accessible - Le serveur Flask n'est pas démarré")
        print("  Démarrez le backend avec: python backend/run.py")
        return False
    except Exception as e:
        print(f"✗ Erreur health check: {e}")
        return False
    
    # Test categories
    try:
        response = requests.get(f"{base_url}/categories", timeout=5)
        if response.status_code == 200:
            categories = response.json()
            print(f"✓ Catégories: {len(categories)} trouvées")
            if categories:
                print("  Premières catégories:")
                for cat in categories[:3]:
                    print(f"    - {cat.get('name', 'N/A')}")
            print()
        else:
            print(f"✗ Catégories: Code {response.status_code}")
    except Exception as e:
        print(f"✗ Erreur catégories: {e}")
    
    # Test products
    try:
        response = requests.get(f"{base_url}/products", timeout=5)
        if response.status_code == 200:
            products = response.json()
            print(f"✓ Produits: {len(products)} trouvés")
            if products:
                print("  Produits:")
                for prod in products:
                    print(f"    - {prod.get('name', 'N/A')} ({prod.get('price', 0)}€)")
            print()
        else:
            print(f"✗ Produits: Code {response.status_code}")
    except Exception as e:
        print(f"✗ Erreur produits: {e}")
    
    print("✅ Tests terminés")
    return True

if __name__ == "__main__":
    test_api()

