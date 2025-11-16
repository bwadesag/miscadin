# 📦 Processus de Commande - Miscadin

## Vue d'ensemble du flux de commande

Ce document explique étape par étape ce qui se passe lorsqu'un utilisateur effectue une commande sur la plateforme Miscadin.

---

## 🔄 Flux complet de la commande

### **1. PRÉPARATION DE LA COMMANDE (Frontend)**

#### Étape 1.1 : Accès à la page Checkout
- **Route** : `/checkout` (protégée, nécessite authentification)
- **Vérification** : Si le panier est vide, redirection vers `/products`
- **Données disponibles** :
  - Articles du panier (`items` depuis `useCartStore`)
  - Informations utilisateur (`user` depuis `useAuthStore`)
  - Total calculé (`getTotal()`)

#### Étape 1.2 : Saisie de l'adresse de livraison
L'utilisateur remplit le formulaire avec :
- **Nom complet** : Pré-rempli depuis le profil utilisateur (lecture seule)
- **Email** : Pré-rempli depuis le profil utilisateur (lecture seule)
- **Adresse** : Champ libre (requis)
- **Code postal** : Champ libre (requis)
- **Ville** : Champ libre (requis)
- **Pays** : Par défaut "France" (modifiable)

#### Étape 1.3 : Validation et envoi
- **Bouton** : "Confirmer la commande"
- **Validation** : 
  - Adresse complète requise
  - Panier non vide
  - Utilisateur authentifié

---

### **2. ENVOI DE LA COMMANDE (Frontend → Backend)**

#### Étape 2.1 : Préparation des données
```typescript
const orderData = {
  items: items.map(item => ({
    product: item.product,      // Objet produit complet
    quantity: item.quantity,     // Quantité commandée
    size: item.size,            // Taille sélectionnée
    color: item.color,          // Couleur sélectionnée
  })),
  shippingAddress: {
    street: address.street,
    city: address.city,
    postalCode: address.postalCode,
    country: address.country
  }
}
```

#### Étape 2.2 : Requête API
- **Méthode** : `POST /api/orders`
- **Headers** : 
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>` (ajouté automatiquement par l'intercepteur axios)
- **Body** : `orderData` (JSON)

---

### **3. TRAITEMENT DE LA COMMANDE (Backend)**

#### Étape 3.1 : Authentification
- **Décorateur** : `@token_required`
- **Vérification** : Token JWT valide
- **Récupération** : `current_user` depuis le token

#### Étape 3.2 : Validation des données
```python
if not data or not data.get('items') or not data.get('shippingAddress'):
    return jsonify({'error': 'Items and shipping address required'}), 400
```

#### Étape 3.3 : Traitement de chaque article

Pour chaque article dans `data['items']` :

1. **Vérification du produit**
   ```python
   product = Product.query.get(item_data['product']['id'])
   if not product:
       return jsonify({'error': f"Product {item_data['product']['id']} not found"}), 404
   ```

2. **Vérification du stock**
   ```python
   if product.stock < item_data['quantity']:
       return jsonify({'error': f"Insufficient stock for {product.name}"}), 400
   ```
   - Si stock insuffisant → **Erreur 400**, commande annulée

3. **Calcul du prix**
   ```python
   item_total = float(product.price) * item_data['quantity']
   total += item_total
   ```

4. **Création de l'OrderItem**
   ```python
   order_item = OrderItem(
       product_id=product.id,
       quantity=item_data['quantity'],
       size=item_data['size'],
       color=item_data['color'],
       price=product.price  # Prix au moment de la commande
   )
   ```

5. **Mise à jour du stock**
   ```python
   product.stock -= item_data['quantity']
   ```
   - ⚠️ **Important** : Le stock est déduit immédiatement lors de la commande

#### Étape 3.4 : Création de la commande
```python
order = Order(
    user_id=current_user.id,      # ID de l'utilisateur connecté
    total=total,                   # Total calculé
    status='pending'               # Statut initial : en attente
)
order.set_shipping_address(data['shippingAddress'])  # Adresse en JSON
order.items = order_items          # Association des articles
```

#### Étape 3.5 : Sauvegarde en base de données
```python
db.session.add(order)
db.session.commit()  # Transaction atomique
```

**Ce qui est sauvegardé** :
- ✅ **Table `orders`** :
  - `id` : Identifiant unique
  - `user_id` : Référence à l'utilisateur
  - `total` : Montant total de la commande
  - `status` : Statut ('pending')
  - `shipping_address` : Adresse en JSON
  - `created_at` : Date/heure de création

- ✅ **Table `order_items`** :
  - Pour chaque article : `product_id`, `quantity`, `size`, `color`, `price`
  - Lien avec la commande via `order_id`

- ✅ **Table `products`** :
  - `stock` : Mis à jour (déduit)

---

### **4. RÉPONSE ET FINALISATION (Backend → Frontend)**

#### Étape 4.1 : Réponse API
- **Status** : `201 Created`
- **Body** : Objet commande complet avec :
  ```json
  {
    "id": "1",
    "userId": "2",
    "items": [...],
    "total": 129.99,
    "status": "pending",
    "shippingAddress": {...},
    "createdAt": "2025-11-16T14:07:06.123456"
  }
  ```

#### Étape 4.2 : Actions frontend
1. **Vidage du panier**
   ```typescript
   clearCart()  // Supprime tous les articles du panier (localStorage)
   ```

2. **Notification de succès**
   ```typescript
   toast.success('Commande passée avec succès !')
   ```

3. **Redirection**
   ```typescript
   navigate('/')  // Retour à la page d'accueil
   ```

---

## 📊 Données stockées en base

### Table `orders`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | Integer | Identifiant unique |
| `user_id` | Integer | Référence à l'utilisateur |
| `total` | Decimal(10,2) | Montant total |
| `status` | String(50) | Statut : pending/processing/shipped/delivered/cancelled |
| `shipping_address` | Text | Adresse en JSON |
| `created_at` | DateTime | Date de création |

### Table `order_items`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | Integer | Identifiant unique |
| `order_id` | Integer | Référence à la commande |
| `product_id` | Integer | Référence au produit |
| `quantity` | Integer | Quantité commandée |
| `size` | String(50) | Taille sélectionnée |
| `color` | String(50) | Couleur sélectionnée |
| `price` | Decimal(10,2) | Prix au moment de la commande |

---

## 🔒 Sécurité et validations

### Validations effectuées

1. **Authentification** : Utilisateur doit être connecté
2. **Données requises** : Items et adresse obligatoires
3. **Produits existants** : Vérification que chaque produit existe
4. **Stock disponible** : Vérification que le stock est suffisant
5. **Transaction atomique** : Si une erreur survient, tout est annulé (rollback)

### Gestion des erreurs

- **400 Bad Request** : Données manquantes ou stock insuffisant
- **401 Unauthorized** : Token invalide ou expiré
- **403 Forbidden** : Accès refusé
- **404 Not Found** : Produit introuvable
- **500 Internal Server Error** : Erreur serveur

---

## 📈 Statuts de commande

Une fois créée, la commande peut avoir les statuts suivants :

1. **`pending`** : En attente (statut initial)
2. **`processing`** : En cours de traitement
3. **`shipped`** : Expédiée
4. **`delivered`** : Livrée
5. **`cancelled`** : Annulée

**Note** : Seul un administrateur peut modifier le statut via `PUT /api/orders/:id/status`

---

## 🔄 Exemple de flux complet

```
1. Utilisateur clique "Passer la commande" sur /cart
   ↓
2. Redirection vers /checkout (si authentifié)
   ↓
3. Saisie de l'adresse de livraison
   ↓
4. Clic sur "Confirmer la commande"
   ↓
5. POST /api/orders avec données
   ↓
6. Backend vérifie :
   - Authentification ✓
   - Produits existants ✓
   - Stock disponible ✓
   ↓
7. Création de la commande en BDD
   - Insertion dans `orders`
   - Insertion dans `order_items`
   - Mise à jour du `stock` des produits
   ↓
8. Réponse 201 avec données de la commande
   ↓
9. Frontend :
   - Vide le panier
   - Affiche notification de succès
   - Redirige vers la page d'accueil
```

---

## ⚠️ Points importants

1. **Stock déduit immédiatement** : Le stock est réduit dès la création de la commande, pas à l'expédition
2. **Prix figé** : Le prix au moment de la commande est sauvegardé dans `order_items.price`
3. **Transaction atomique** : Si une erreur survient, toutes les modifications sont annulées
4. **Authentification requise** : Impossible de passer commande sans être connecté
5. **Validation du stock** : Si un produit n'a plus de stock, la commande entière est refusée

---

---

## 📋 APRÈS LA CRÉATION DE LA COMMANDE

### **5. GESTION ADMINISTRATEUR**

Une fois la commande créée, elle est disponible dans l'interface d'administration.

#### Étape 5.1 : Visualisation des commandes
- **Route admin** : `/admin/orders`
- **Accès** : Uniquement pour les utilisateurs avec le rôle `admin`
- **Fonctionnalités** :
  - Liste de toutes les commandes
  - Filtres par statut (Toutes, En attente, En traitement, Expédiée, Livrée, Annulée)
  - Compteurs par statut
  - Affichage des informations principales : ID, date, total, nombre d'articles

#### Étape 5.2 : Détails d'une commande
En cliquant sur une commande, l'admin peut voir :
- **Statut actuel** : Badge coloré avec icône
- **Articles commandés** : 
  - Image du produit
  - Nom du produit
  - Taille et couleur sélectionnées
  - Quantité et prix unitaire
- **Total de la commande**
- **Adresse de livraison** : Complète avec rue, code postal, ville, pays
- **Date de commande** : Format français complet

#### Étape 5.3 : Gestion du statut
L'admin peut modifier le statut de la commande via des boutons :

1. **"Passer à [statut suivant]"** :
   - `pending` → `processing` (En traitement)
   - `processing` → `shipped` (Expédiée)
   - `shipped` → `delivered` (Livrée)

2. **"Annuler la commande"** :
   - Disponible pour les statuts : `pending`, `processing`, `shipped`
   - Change le statut à `cancelled`

**API utilisée** : `PUT /api/orders/:id/status`
```json
{
  "status": "processing" | "shipped" | "delivered" | "cancelled"
}
```

#### Étape 5.4 : Dashboard Admin
Le tableau de bord (`/admin`) affiche :
- **Carte "Commandes"** :
  - Nombre total de commandes
  - Nombre de commandes en attente (sous-titre)
  - Lien vers `/admin/orders`

---

## 🔄 Workflow complet après création

```
1. Commande créée (status: 'pending')
   ↓
2. Commande visible dans /admin/orders
   ↓
3. Admin clique sur la commande
   ↓
4. Admin voit les détails :
   - Articles commandés
   - Adresse de livraison
   - Total
   ↓
5. Admin change le statut :
   - pending → processing (préparation)
   - processing → shipped (expédition)
   - shipped → delivered (livraison)
   ↓
6. Commande terminée
```

---

## 📊 Statuts de commande détaillés

| Statut | Label | Description | Action suivante |
|--------|-------|-------------|-----------------|
| `pending` | En attente | Commande créée, en attente de traitement | → `processing` |
| `processing` | En traitement | Commande en cours de préparation | → `shipped` |
| `shipped` | Expédiée | Commande envoyée au client | → `delivered` |
| `delivered` | Livrée | Commande reçue par le client | Aucune |
| `cancelled` | Annulée | Commande annulée | Aucune |

---

## 🛠️ Améliorations possibles

- [ ] Gestion des commandes partiellement validées (si un seul produit manque de stock)
- [ ] Système de paiement intégré
- [ ] Email de confirmation de commande
- [ ] Notification admin lors d'une nouvelle commande (notification push)
- [ ] Historique des commandes pour l'utilisateur (page `/orders`)
- [ ] Suivi de livraison en temps réel
- [ ] Export des commandes (CSV, PDF)
- [ ] Recherche et filtres avancés (par date, montant, client)
- [ ] Restauration du stock si commande annulée



