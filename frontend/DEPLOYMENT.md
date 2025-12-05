# NovoKerp React - Deployment Checklist

## 📋 Pré-Deployment

### 1. Código
- [ ] Todos os testes passando
- [ ] Sem erros de TypeScript (`npm run build`)
- [ ] Sem warnings críticos no console
- [ ] Code review completo
- [ ] Branch atualizado com main/master

### 2. Configuração
- [ ] Variáveis de ambiente configuradas
- [ ] URLs de API corretas para produção
- [ ] Secrets configurados (se aplicável)
- [ ] CORS configurado no backend

### 3. Performance
- [ ] Bundle size otimizado
- [ ] Lazy loading implementado
- [ ] Imagens otimizadas
- [ ] Cache configurado

---

## 🚀 Build de Produção

### 1. Criar Build
```bash
cd frontend
npm run build
```

### 2. Testar Build Localmente
```bash
npm run preview
```

### 3. Verificar Arquivos Gerados
```bash
ls -lh dist/
# Verificar tamanho dos arquivos
```

---

## 🌐 Deploy Options

### Opção 1: Vercel (Recomendado para React)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deploy
vercel --prod
```

**Configuração Vercel:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Opção 2: Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy

# Production deploy
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Opção 3: Servidor Próprio (Nginx)

**1. Build:**
```bash
npm run build
```

**2. Copiar para servidor:**
```bash
scp -r dist/* user@server:/var/www/novokerp/
```

**3. Configurar Nginx:**
```nginx
server {
    listen 80;
    server_name novokerp.com.br;
    root /var/www/novokerp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (se necessário)
    location /api {
        proxy_pass http://backend-server:port;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔐 Variáveis de Ambiente

### Desenvolvimento (.env)
```bash
VITE_API_URL=http://localhost:3000
```

### Produção (.env.production)
```bash
VITE_API_URL=https://api.novokerp.com.br
```

**IMPORTANTE:** Nunca commitar arquivos `.env` com secrets!

---

## ✅ Pós-Deployment

### 1. Verificações Imediatas
- [ ] Site carrega corretamente
- [ ] Login funciona
- [ ] Dashboard carrega dados
- [ ] Funcionários lista funciona
- [ ] Sem erros no console
- [ ] Responsivo em mobile

### 2. Testes de Integração
- [ ] Autenticação com backend de produção
- [ ] Todas as APIs funcionando
- [ ] CORS configurado corretamente
- [ ] Performance aceitável (< 3s load)

### 3. Monitoramento
- [ ] Analytics configurado (Google Analytics, etc)
- [ ] Error tracking (Sentry, etc)
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## 🔄 CI/CD (Opcional)

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

---

## 🐛 Rollback Plan

### Se algo der errado:

**Vercel/Netlify:**
```bash
# Reverter para deployment anterior
vercel rollback
# ou
netlify rollback
```

**Servidor Próprio:**
```bash
# Manter backup do dist anterior
cp -r dist dist.backup.$(date +%Y%m%d)

# Para reverter:
rm -rf dist
mv dist.backup.YYYYMMDD dist
```

---

## 📊 Performance Targets

### Métricas Esperadas:
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Bundle Size:** < 500KB (gzipped)

### Ferramentas de Teste:
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix

---

## 🔒 Segurança

### Checklist:
- [ ] HTTPS configurado
- [ ] Headers de segurança (CSP, X-Frame-Options)
- [ ] Sem secrets no código
- [ ] Dependências atualizadas
- [ ] Rate limiting no backend
- [ ] Input validation

---

## 📝 Documentação de Produção

### Informações a Documentar:
- URL de produção
- Credenciais de acesso (em local seguro)
- Processo de deploy
- Contatos de suporte
- Logs e monitoramento

---

## 🎯 Próximos Passos Pós-Deploy

1. **Monitorar** primeiras 24h ativamente
2. **Coletar feedback** dos usuários
3. **Corrigir bugs** críticos imediatamente
4. **Planejar** próximas features (Phase 3 completa, Phase 4)
5. **Otimizar** baseado em métricas reais

---

**Última atualização:** 02/12/2024
