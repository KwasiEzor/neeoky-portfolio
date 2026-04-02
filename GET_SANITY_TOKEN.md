# 🔑 Comment Obtenir Votre Sanity API Token

## Étapes Rapides (2 minutes)

### 1. Accéder au Dashboard Sanity

Allez sur: **https://www.sanity.io/manage**

### 2. Sélectionner Votre Projet

- Trouvez le projet **neeoky-portfolio** (ID: `cbdkq097`)
- Cliquez dessus pour ouvrir

### 3. Naviguer vers API

Dans le menu de gauche:
- Cliquez sur **API**
- Puis sur **Tokens**

### 4. Créer un Nouveau Token

1. Cliquez sur **"Add API token"** ou **"Create new token"**

2. Remplissez les informations:
   ```
   Label: Production API Token
   Permissions: Editor
   ```

   ⚠️ **Important**: Sélectionnez **"Editor"** pour permettre la création de documents

3. Cliquez sur **"Add token"** ou **"Create"**

### 5. Copier le Token

Le token sera affiché **une seule fois**:
- Format: `sk_prod_xxxxxxxxxxxxxxxxxx`
- **Copiez-le immédiatement!**
- Vous ne pourrez plus le voir après

### 6. Ajouter au Fichier .env

Ouvrez `/Users/macbook/Documents/codes/neeoky-portfolio/.env` et ajoutez:

```bash
SANITY_API_TOKEN=sk_prod_votre_token_copié_ici
```

### 7. Tester

```bash
node scripts/test-env.js
```

Vous devriez voir:
```
✅ Sanity: Connexion OK (0 leads dans la base)
🎯 Score: 100%
```

---

## 🔒 Sécurité du Token

### ✅ À FAIRE
- Garder le token dans `.env` (jamais commité)
- Utiliser des tokens différents pour dev/prod
- Régénérer si compromis

### ❌ NE PAS FAIRE
- Commit le token dans Git
- Partager le token publiquement
- L'utiliser côté client

---

## 🆘 Problèmes Courants

### Le token ne fonctionne pas

**Vérifications:**
1. Le token commence par `sk_` (pas `skp_`)
2. Les permissions sont bien "Editor" ou "Admin"
3. Le projet ID est correct (`cbdkq097`)
4. Pas d'espaces avant/après le token dans `.env`

### Je ne trouve pas mon projet

**Solutions:**
1. Vérifiez que vous êtes connecté au bon compte
2. Cherchez par ID: `cbdkq097`
3. Vérifiez dans "All projects" si vous avez plusieurs organisations

### Le token a expiré

**Solution:**
- Les tokens Sanity n'expirent pas par défaut
- Si révoqué, créez-en un nouveau
- Vérifiez dans Sanity > API > Tokens > Active tokens

---

## 📝 Configuration Complète Recommandée

Une fois le token obtenu, votre `.env` devrait ressembler à:

```bash
# ========================================
# SANITY CMS (REQUIS)
# ========================================
SANITY_PROJECT_ID=cbdkq097
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-18
SANITY_API_TOKEN=sk_prod_votre_token_ici  # ← AJOUTEZ CECI

# ========================================
# EMAIL (RESEND)
# ========================================
RESEND_API_KEY=re_ZJ69WF1Z_mU6s9ZP2ZARayRNJHfywC43N
FROM_EMAIL=Neeoky <noreply@neeoky.com>    # ← RECOMMANDÉ
ADMIN_EMAIL=contact@neeoky.com            # ← RECOMMANDÉ

# ========================================
# RATE LIMITING (UPSTASH)
# ========================================
UPSTASH_REDIS_REST_URL=https://precious-mantis-89954.upstash.io
UPSTASH_REDIS_REST_TOKEN=gQAAAAAAAV9iAAIncDIyMDYyNDcyOGU4MmM0Yjk2YmQ2NDJkMjk0OGY4OWE0NXAyODk5NTQ

# ========================================
# CLOUDFLARE TURNSTILE
# ========================================
TURNSTILE_SECRET_KEY=0x4AAAAAACzLK5ujFEuc5W5N
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACzLKzTHSUSGHtjdjGeVDWX_UJY

# ========================================
# ANALYTICS (OPTIONNEL)
# ========================================
PUBLIC_PLAUSIBLE_DOMAIN=neeoky.com        # ← OPTIONNEL
```

---

## ✅ Après Configuration

1. **Tester**: `node scripts/test-env.js`
2. **Déployer le schema**: `cd studio && npx sanity schema deploy`
3. **Lancer le projet**: `npm run dev`
4. **Tester le formulaire**: http://localhost:4321/demande-devis

---

**Besoin d'aide?** Consultez la [documentation Sanity](https://www.sanity.io/docs/http-auth)
