"""Script pour nettoyer et regrouper les catégories."""
from backend.app import create_app, db
from backend.models import Category, Product
from backend.config import Config

app = create_app(Config)

# Mapping des anciennes catégories vers les nouvelles
category_mapping = {
    'vetements': 'chemises',  # Par défaut vers Chemises, mais on peut être plus précis
    'chaussures': 'sneakers',  # Par défaut vers Sneakers
    'accessoires': 'maroquinerie',  # Par défaut vers Maroquinerie
    'berwick': None,  # À supprimer
}

# Catégories à supprimer (génériques ou erreurs)
categories_to_remove = ['vetements', 'chaussures', 'accessoires', 'berwick']

with app.app_context():
    print("🧹 Nettoyage des catégories...\n")
    
    # 1. Migrer les produits des anciennes catégories vers les nouvelles
    migrated_count = 0
    for old_slug, new_slug in category_mapping.items():
        old_category = Category.query.filter_by(slug=old_slug).first()
        if old_category and new_slug:
            new_category = Category.query.filter_by(slug=new_slug).first()
            if new_category:
                products = Product.query.filter_by(category_id=old_category.id).all()
                for product in products:
                    product.category_id = new_category.id
                    migrated_count += 1
                print(f"✓ {len(products)} produit(s) migré(s) de '{old_category.name}' vers '{new_category.name}'")
    
    # 2. Migrer les produits restants de "berwick" vers une catégorie appropriée
    berwick = Category.query.filter_by(slug='berwick').first()
    if berwick:
        products = Product.query.filter_by(category_id=berwick.id).all()
        if products:
            # Migrer vers "Chemises" par défaut (ou la première catégorie disponible)
            default_category = Category.query.filter_by(slug='chemises').first()
            if default_category:
                for product in products:
                    product.category_id = default_category.id
                    migrated_count += 1
                print(f"✓ {len(products)} produit(s) migré(s) de 'berwick' vers '{default_category.name}'")
    
    # 3. Supprimer les anciennes catégories génériques
    deleted_count = 0
    for slug in categories_to_remove:
        category = Category.query.filter_by(slug=slug).first()
        if category:
            # Vérifier s'il reste des produits
            remaining_products = Product.query.filter_by(category_id=category.id).count()
            if remaining_products > 0:
                print(f"⚠️  '{category.name}' a encore {remaining_products} produit(s), migration nécessaire")
            else:
                db.session.delete(category)
                deleted_count += 1
                print(f"✓ Catégorie '{category.name}' supprimée")
    
    if migrated_count > 0 or deleted_count > 0:
        db.session.commit()
        print(f"\n✅ Nettoyage terminé : {migrated_count} produit(s) migré(s), {deleted_count} catégorie(s) supprimée(s)")
    else:
        print("\n✅ Aucune action nécessaire")

