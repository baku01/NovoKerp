#!/bin/bash

# NovoKerp React - Quick Start Script

echo "🚀 NovoKerp React - Iniciando..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script dentro do diretório frontend/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo "✅ Dependências instaladas!"
    echo ""
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando..."
    echo "VITE_API_URL=http://www.atscs.com.br/" > .env
    echo "✅ Arquivo .env criado!"
    echo ""
fi

echo "🎯 Rotas disponíveis:"
echo "  - /login         → Autenticação"
echo "  - /dashboard     → Dashboard de Obras"
echo "  - /funcionarios  → Lista de Funcionários"
echo ""

echo "📚 Documentação:"
echo "  - README.md         → Visão geral"
echo "  - DEVELOPMENT.md    → Guia de desenvolvimento"
echo ""

echo "🌐 Iniciando servidor de desenvolvimento..."
echo "   Abrindo em http://localhost:5173"
echo ""

npm run dev
