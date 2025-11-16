"""Initialize database with tables and sample data."""
from backend.app import create_app, db
from backend.models import User, Category, Product
from backend.config import Config

app = create_app(Config)

with app.app_context():
    # Create all tables
    db.create_all()
    
    # Check if admin user already exists
    admin = User.query.filter_by(email='admin@miscadin.com').first()
    if not admin:
        # Create admin user
        admin = User(
            email='admin@miscadin.com',
            name='Admin',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        print("[OK] Admin user created (admin@miscadin.com / admin123)")
    
    # Check if demo user exists
    demo_user = User.query.filter_by(email='user@example.com').first()
    if not demo_user:
        demo_user = User(
            email='user@example.com',
            name='John Doe',
            role='user'
        )
        demo_user.set_password('user123')
        db.session.add(demo_user)
        print("[OK] Demo user created (user@example.com / user123)")
    
    # Create categories if they don't exist - Prêt-à-porter Homme complet
    categories_data = [
        # HAUTS
        {
            'name': 'Chemises', 
            'slug': 'chemises', 
            'description': 'Chemises classiques et casual pour homme',
            'image': 'https://images.unsplash.com/photo-1594938298606-0b8d0b8b8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'T-shirts & Polos', 
            'slug': 't-shirts-polos', 
            'description': 'T-shirts basiques, polos et t-shirts graphiques',
            'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Pulls & Sweats', 
            'slug': 'pulls-sweats', 
            'description': 'Pulls, sweats à capuche, cardigans et gilets',
            'image': 'https://images.unsplash.com/photo-1556821840-3a63f95609a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Vestes & Manteaux', 
            'slug': 'vestes-manteaux', 
            'description': 'Blazers, vestes, manteaux et doudounes',
            'image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        
        # BAS
        {
            'name': 'Pantalons', 
            'slug': 'pantalons', 
            'description': 'Pantalons chinos, de costume, cargo et jogging',
            'image': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Jeans', 
            'slug': 'jeans', 
            'description': 'Jeans slim, regular, skinny et bootcut',
            'image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Shorts', 
            'slug': 'shorts', 
            'description': 'Shorts de plage, de sport, chinos et bermudas',
            'image': 'https://images.unsplash.com/photo-1506629905607-2c5a0e5a0a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        
        # CHAUSSURES
        {
            'name': 'Chaussures de ville', 
            'slug': 'chaussures-ville', 
            'description': 'Derbies, richelieu, mocassins et bottines',
            'image': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Sneakers', 
            'slug': 'sneakers', 
            'description': 'Sneakers basiques, sport et premium',
            'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Chaussures de sport', 
            'slug': 'chaussures-sport', 
            'description': 'Running, fitness, tennis et basketball',
            'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Chaussures casual', 
            'slug': 'chaussures-casual', 
            'description': 'Espadrilles, sandales et chaussures bateau',
            'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        
        # ACCESSOIRES
        {
            'name': 'Maroquinerie', 
            'slug': 'maroquinerie', 
            'description': 'Sacs à dos, portefeuilles et porte-documents',
            'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Ceintures', 
            'slug': 'ceintures', 
            'description': 'Ceintures en cuir et en tissu',
            'image': 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Montres & Bijoux', 
            'slug': 'montres-bijoux', 
            'description': 'Montres classiques, sport, connectées et bijoux',
            'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Lunettes', 
            'slug': 'lunettes', 
            'description': 'Lunettes de soleil, de vue et de sport',
            'image': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Chapeaux & Bonnets', 
            'slug': 'chapeaux-bonnets', 
            'description': 'Casquettes, bonnets et chapeaux',
            'image': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Écharpes & Gants', 
            'slug': 'echarpes-gants', 
            'description': 'Écharpes, foulards, gants et mitaines',
            'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        
        # SOUS-VÊTEMENTS
        {
            'name': 'Sous-vêtements', 
            'slug': 'sous-vetements', 
            'description': 'Boxers, slips, caleçons et t-shirts de corps',
            'image': 'https://images.unsplash.com/photo-1586350977772-b3b7ab4b3c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Chaussettes', 
            'slug': 'chaussettes', 
            'description': 'Chaussettes classiques, hautes et de sport',
            'image': 'https://images.unsplash.com/photo-1586350977772-b3b7ab4b3c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        
        # SPORT & FITNESS
        {
            'name': 'Vêtements de sport', 
            'slug': 'vetements-sport', 
            'description': 'T-shirts, shorts, leggings et survêtements de sport',
            'image': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            'name': 'Maillots de bain', 
            'slug': 'maillots-bain', 
            'description': 'Shorts de bain, bermudas et maillots',
            'image': 'https://images.unsplash.com/photo-1506629905607-2c5a0e5a0a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        
        # COFFRETS
        {
            'name': 'Coffrets & Cadeaux', 
            'slug': 'coffrets-cadeaux', 
            'description': 'Coffrets cadeaux et sets de vêtements',
            'image': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
    ]
    
    for cat_data in categories_data:
        category = Category.query.filter_by(slug=cat_data['slug']).first()
        if not category:
            category = Category(**cat_data)
            db.session.add(category)
            print(f"[OK] Category created: {cat_data['name']}")
    
    db.session.commit()
    
    # Create sample products if they don't exist
    vetements = Category.query.filter_by(slug='vetements').first()
    chaussures = Category.query.filter_by(slug='chaussures').first()
    
    if vetements and not Product.query.first():
        products_data = [
            {
                'name': 'Chemise Premium',
                'description': 'Chemise élégante en coton premium',
                'price': 79.99,
                'original_price': 99.99,
                'category_id': vetements.id,
                'stock': 50,
                'sizes': ['S', 'M', 'L', 'XL'],
                'colors': ['Blanc', 'Bleu', 'Noir'],
                'featured': True,
                'images': ['https://images.unsplash.com/photo-1594938298606-0b8d0b8b8b8b?w=500']
            },
            {
                'name': 'Sneakers Sport',
                'description': 'Sneakers confortables pour tous les jours',
                'price': 129.99,
                'category_id': chaussures.id,
                'stock': 30,
                'sizes': ['40', '41', '42', '43', '44'],
                'colors': ['Blanc', 'Noir', 'Gris'],
                'featured': True,
                'images': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500']
            },
        ]
        
        for prod_data in products_data:
            # Extraire les listes qui doivent être converties en JSON
            images = prod_data.pop('images', [])
            sizes = prod_data.pop('sizes', [])
            colors = prod_data.pop('colors', [])
            
            # Créer le produit avec les autres données
            product = Product(**prod_data)
            
            # Utiliser les méthodes set_* pour convertir les listes en JSON
            product.set_images(images)
            product.set_sizes(sizes)
            product.set_colors(colors)
            
            db.session.add(product)
            print(f"[OK] Product created: {prod_data['name']}")
    
    db.session.commit()
    print("\n[OK] Database initialized successfully!")

