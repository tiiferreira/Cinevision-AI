# 📚 Documentação Técnica - CineVision AI

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura e Estrutura](#arquitetura-e-estrutura)
3. [Bibliotecas e Dependências](#bibliotecas-e-dependências)
4. [Metodologia e Padrões](#metodologia-e-padrões)
5. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
6. [Componentes Detalhados](#componentes-detalhados)
7. [Serviços e Lógica de Negócio](#serviços-e-lógica-de-negócio)
8. [Segurança e Ofuscação](#segurança-e-ofuscação)
9. [Configurações e Build](#configurações-e-build)
10. [Tipos e Interfaces](#tipos-e-interfaces)

---

## 🎯 Visão Geral do Projeto

### O que é o CineVision AI?

O **CineVision AI** é uma aplicação web moderna que utiliza Inteligência Artificial (Google Gemini) para transformar conteúdo visual e textual em análises cinematográficas profissionais e storyboards detalhados.

### Funcionalidades Principais

1. **Análise de Imagem/Vídeo Cinematográfica**
   - Gera prompts detalhados otimizados para geradores de imagem AI (Midjourney, DALL-E)
   - Sugere ângulos de câmera alternativos
   - Fornece ideias de iluminação
   - Cria conceitos comerciais baseados na imagem

2. **Geração de Storyboard a partir de Texto**
   - Transforma histórias/roteiros em storyboards cinematográficos
   - Gera cenas detalhadas com cabeçalhos de roteiro
   - Cria prompts JSON técnicos para cada cena
   - Mantém consistência visual quando há imagem de referência

### Público-Alvo

- Diretores de fotografia
- Criadores de conteúdo
- Roteiristas
- Profissionais de marketing
- Estudantes de cinema

---

## 🏗️ Arquitetura e Estrutura

### Estrutura de Pastas

```
Cinevision-AI/
├── components/          # Componentes React reutilizáveis
│   ├── AnalysisResult.tsx      # Exibe resultados da análise de imagem
│   ├── ApiKeyScreen.tsx        # Tela de configuração de API Key
│   ├── Header.tsx              # Cabeçalho da aplicação
│   ├── ImageUploader.tsx      # Upload de imagens/vídeos
│   ├── StoryboardResult.tsx   # Exibe storyboard gerado
│   └── StoryInput.tsx          # Input de texto para storyboard
├── services/           # Lógica de negócio e integrações
│   └── geminiService.ts        # Serviço de integração com Gemini AI
├── App.tsx             # Componente principal da aplicação
├── index.tsx           # Ponto de entrada React
├── index.html          # HTML base
├── types.ts            # Definições TypeScript
├── vite.config.ts      # Configuração do Vite
├── tsconfig.json       # Configuração TypeScript
└── package.json        # Dependências e scripts
```

### Padrão Arquitetural

O projeto segue o padrão **Component-Based Architecture** com separação clara de responsabilidades:

- **Componentes (UI)**: Responsáveis apenas pela apresentação
- **Serviços**: Contêm toda a lógica de negócio e integrações
- **Types**: Centraliza todas as definições de tipos TypeScript
- **App.tsx**: Orquestra o estado global e fluxo da aplicação

---

## 📦 Bibliotecas e Dependências

### Dependências de Produção

#### 1. **React 19.2.3** e **React-DOM 19.2.3**
**Por quê?**
- Framework moderno e performático para interfaces
- Versão 19 traz melhorias de performance e novas features
- Hooks para gerenciamento de estado funcional
- Virtual DOM para renderização eficiente

**Uso no projeto:**
- Todos os componentes são React Functional Components
- Uso extensivo de hooks: `useState`, `useEffect`, `useCallback`
- React StrictMode para detectar problemas em desenvolvimento

#### 2. **@google/genai 1.34.0**
**Por quê?**
- SDK oficial do Google para integração com modelos Gemini
- Suporta múltiplos modelos (Gemini 2.5 Flash, Pro, etc.)
- Funcionalidades avançadas: JSON Schema, multimodal (imagem + texto)
- TypeScript nativo

**Uso no projeto:**
- `geminiService.ts` utiliza para:
  - Análise de imagens/vídeos
  - Geração de storyboards
  - Validação de respostas via JSON Schema
  - Fallback automático entre modelos

#### 3. **lucide-react 0.562.0**
**Por quê?**
- Biblioteca de ícones moderna e leve
- TypeScript nativo
- Tree-shaking automático (apenas ícones usados são incluídos)
- Consistência visual

**Uso no projeto:**
- Ícones em todos os componentes (Upload, Settings, Film, etc.)
- Melhora UX com feedback visual

### Dependências de Desenvolvimento

#### 1. **Vite 6.2.0**
**Por quê?**
- Build tool extremamente rápido
- Hot Module Replacement (HMR) instantâneo
- Suporte nativo a TypeScript e React
- Otimizações automáticas de produção

**Configurações especiais:**
- Minificação com esbuild
- Alias de paths (`@/` para raiz)
- Variáveis de ambiente injetadas

#### 2. **TypeScript 5.8.2**
**Por quê?**
- Type safety em todo o código
- Autocomplete inteligente
- Detecção de erros em tempo de desenvolvimento
- Melhor refatoração

**Configurações:**
- Target: ES2022
- JSX: react-jsx
- Module: ESNext
- Strict mode habilitado

#### 3. **@vitejs/plugin-react 5.0.0**
**Por quê?**
- Plugin oficial para React no Vite
- Suporte a Fast Refresh
- Otimizações específicas para React

---

## 🎨 Metodologia e Padrões

### 1. **Component-Based Development**

Cada funcionalidade é um componente isolado e reutilizável:

```typescript
// Exemplo: Componente isolado com props tipadas
interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}
```

**Vantagens:**
- Código modular e testável
- Fácil manutenção
- Reutilização

### 2. **State Management com React Hooks**

O projeto usa apenas hooks nativos do React (sem Redux/Zustand):

- **useState**: Estado local dos componentes
- **useEffect**: Efeitos colaterais (verificação de API key)
- **useCallback**: Memoização de funções para evitar re-renders

**Exemplo:**
```typescript
const [appState, setAppState] = useState<AppState>(AppState.IDLE);
const handleImageSelected = useCallback(async (base64Image: string) => {
  // Lógica assíncrona
}, []);
```

### 3. **TypeScript First**

Tudo é tipado desde o início:

- Interfaces para props
- Enums para estados
- Types para união de tipos
- Tipagem de retornos de funções

**Benefícios:**
- Erros detectados em desenvolvimento
- Documentação implícita
- Refatoração segura

### 4. **Separation of Concerns**

Separação clara entre:
- **UI** (components): Apenas apresentação
- **Lógica** (services): Regras de negócio
- **Tipos** (types.ts): Contratos de dados

### 5. **Error Handling Robusto**

Tratamento de erros em múltiplas camadas:

1. **Validação de entrada** (componentes)
2. **Tratamento de API** (serviços)
3. **Feedback visual** (UI)

**Exemplo:**
```typescript
try {
  const data = await analyzeImageForCinema(base64Image);
  setImageResult(data);
  setAppState(AppState.SUCCESS);
} catch (err) {
  setAppState(AppState.ERROR);
  setErrorMsg("Falha ao analisar a imagem...");
}
```

### 6. **Progressive Enhancement**

- Funciona sem JavaScript (estrutura HTML)
- Melhora com JavaScript habilitado
- Fallbacks para recursos não suportados

---

## 🔄 Fluxo de Funcionamento

### Fluxo Geral da Aplicação

```
1. Usuário acessa aplicação
   ↓
2. Verifica se API Key está configurada
   ↓
3a. Se NÃO → Mostra ApiKeyScreen
   ↓
3b. Se SIM → Mostra interface principal
   ↓
4. Usuário escolhe funcionalidade:
   ├─ Análise de Imagem
   │   ↓
   │   Upload imagem/vídeo
   │   ↓
   │   Conversão para Base64
   │   ↓
   │   Envio para Gemini AI
   │   ↓
   │   Processamento com JSON Schema
   │   ↓
   │   Exibição de resultados
   │
   └─ Geração de Storyboard
       ↓
       Input de texto (história)
       ↓
       Opcional: Usa contexto de imagem analisada
       ↓
       Envio para Gemini AI
       ↓
       Geração de múltiplas cenas
       ↓
       Validação de estrutura
       ↓
       Exibição de storyboard
```

### Fluxo Detalhado: Análise de Imagem

1. **Upload** (`ImageUploader.tsx`)
   - Usuário arrasta ou seleciona arquivo
   - Validação: tamanho máximo 20MB, formatos suportados
   - Conversão para Base64 via FileReader API

2. **Processamento** (`geminiService.ts`)
   - Detecta tipo de mídia (imagem/vídeo)
   - Limpa Base64 (remove data URI prefix)
   - Seleciona modelo Gemini (com fallback)
   - Cria prompt especializado
   - Define JSON Schema para resposta estruturada

3. **Chamada à API**
   - Envia imagem + prompt + schema
   - Gemini processa e retorna JSON estruturado
   - Valida resposta

4. **Exibição** (`AnalysisResult.tsx`)
   - Renderiza prompt cinematográfico
   - Lista ângulos sugeridos
   - Mostra sugestões de iluminação
   - Exibe conceitos comerciais

### Fluxo Detalhado: Geração de Storyboard

1. **Input** (`StoryInput.tsx`)
   - Usuário digita história/roteiro
   - Validação: mínimo 10 caracteres, máximo 8000
   - Indica se há contexto visual ativo

2. **Processamento** (`geminiService.ts`)
   - Valida tamanho da história
   - Prepara contexto visual (se houver imagem)
   - Cria prompt detalhado com instruções
   - Define schema complexo (objetos aninhados)
   - Tenta múltiplos modelos em sequência

3. **Geração**
   - Gemini gera storyboard completo
   - Retorna JSON com: título, logline, array de cenas
   - Cada cena contém: cabeçalho, descrição, tipo de plano, prompt JSON

4. **Validação**
   - Verifica estrutura do JSON
   - Valida campos obrigatórios
   - Garante que há pelo menos uma cena

5. **Exibição** (`StoryboardResult.tsx`)
   - Mostra título e logline
   - Renderiza cada cena em card
   - Exibe prompt JSON formatado
   - Permite copiar JSON

---

## 🧩 Componentes Detalhados

### 1. **App.tsx** - Componente Principal

**Responsabilidades:**
- Gerenciamento de estado global
- Roteamento lógico (tabs)
- Orquestração de fluxos
- Verificação de API Key

**Estados Gerenciados:**
```typescript
- hasApiKeyConfigured: boolean
- activeTab: 'image' | 'story'
- appState: IDLE | ANALYZING | SUCCESS | ERROR
- currentImage: string | null
- imageResult: CineAnalysisResult | null
- storyResult: StoryboardResult | null
- errorMsg: string | null
```

**Funções Principais:**
- `handleApiKeySet`: Configura API key
- `handleTabChange`: Alterna entre funcionalidades
- `handleImageSelected`: Processa upload de imagem
- `handleStorySubmit`: Processa geração de storyboard

### 2. **ImageUploader.tsx**

**Funcionalidades:**
- Drag & Drop de arquivos
- Upload via input file
- Preview de imagem/vídeo
- Validação de formato e tamanho
- Conversão para Base64

**Estados:**
- `preview`: Base64 da imagem/vídeo
- `error`: Mensagens de erro
- `fileType`: 'image' | 'video' | null

**Validações:**
- Tamanho máximo: 20MB
- Formatos: image/*, video/*
- Feedback visual de erro

### 3. **AnalysisResult.tsx**

**Exibe:**
- Prompt cinematográfico (copiável)
- 3 ângulos de câmera sugeridos
- 3 sugestões de iluminação
- 2 conceitos comerciais

**Design:**
- Cards organizados em grid
- Ícones temáticos (Camera, Lightbulb, Film)
- Botão de copiar para clipboard

### 4. **StoryInput.tsx**

**Funcionalidades:**
- Textarea para história
- Indicação de contexto visual ativo
- Validação de tamanho mínimo
- Botão desabilitado durante loading

**Estados:**
- `story`: Texto digitado
- Validação em tempo real

### 5. **StoryboardResult.tsx**

**Estrutura:**
- Título e logline no topo
- Cards de cena em sequência
- Cada card contém:
  - Cabeçalho de cena (formato roteiro)
  - Descrição visual
  - Tipo de plano
  - Prompt JSON formatado

**Componente Interno:**
- `JsonBlock`: Exibe e permite copiar JSON

### 6. **ApiKeyScreen.tsx**

**Funcionalidades:**
- Input de API Key (tipo password)
- Validação básica (mínimo 10 caracteres)
- Armazenamento em localStorage
- Link para obter API Key

**Segurança:**
- Input tipo password (oculta texto)
- Armazenamento local (não envia para servidor)

### 7. **Header.tsx**

**Elementos:**
- Logo e nome da aplicação
- Badge "Powered by Gemini 3 Flash"
- Botão de configurações (alterar API Key)

---

## ⚙️ Serviços e Lógica de Negócio

### geminiService.ts

Este é o coração da aplicação, contendo toda a lógica de integração com a API do Gemini.

#### Funções Principais

**1. `_a1()` - getApiKey (ofuscado)**
```typescript
// Busca API Key em:
// 1. localStorage (chave ofuscada: '_k1')
// 2. Variáveis de ambiente
// Retorna null se não encontrada
```

**2. `setApiKey(key: string)`**
- Armazena API Key no localStorage
- Reseta instância do AI (força recriação)

**3. `hasApiKey()`**
- Verifica se há API Key configurada

**4. `_a3()` - getAI (ofuscado)**
- Cria ou retorna instância do GoogleGenAI
- Implementa cache (não recria se mesma key)
- Lazy loading do módulo @google/genai

**5. `detectMediaType(base64Data: string)`**
- Detecta MIME type do arquivo
- Identifica se é vídeo ou imagem
- Retorna padrão 'image/jpeg' se não detectar

**6. `analyzeImageForCinema(base64Media: string)`**

**Processo:**
1. Obtém instância do AI
2. Importa Type do @google/genai
3. Define JSON Schema para resposta:
   ```typescript
   {
     cinematicPrompt: string,
     cameraAngles: string[],
     lightingSuggestions: string[],
     commercialIdeas: CommercialIdea[]
   }
   ```
4. Limpa Base64 (remove prefixo data URI)
5. Detecta tipo de mídia
6. Cria prompt especializado
7. Tenta modelos em sequência (fallback)
8. Processa resposta JSON
9. Retorna objeto tipado

**Fallback de Modelos:**
```typescript
const modelsToTry = [
  "gemini-2.5-flash",      // Estável, 1M tokens
  "gemini-2.5-pro",        // Estável, 1M tokens
  "gemini-flash-latest",   // Última versão
  "gemini-pro-latest",     // Última versão
  "gemini-2.0-flash",      // Versão 2.0
  "gemini-2.0-flash-001",  // Versão específica
  "gemini-2.0-flash-exp"   // Experimental
];
```

**7. `generateStoryboardFromText(...)`**

**Parâmetros:**
- `story`: Texto da história
- `imageBase64`: Opcional - imagem de referência
- `analysisContext`: Opcional - contexto visual da análise

**Processo:**
1. Valida tamanho (máximo 8000 caracteres)
2. Obtém instância do AI
3. Define schema complexo (objetos aninhados):
   ```typescript
   {
     title: string,
     logline: string,
     scenes: [
       {
         sceneHeader: string,
         visualDescription: string,
         shotType: string,
         jsonPrompt: {
           positive: string,
           negative: string,
           camera: string,
           aspect_ratio: string
         }
       }
     ]
   }
   ```
4. Prepara partes da requisição:
   - Imagem (se fornecida)
   - Prompt com instruções detalhadas
5. Tenta modelos com fallback
6. Processa resposta de múltiplas formas (resiliente)
7. Valida estrutura completa
8. Retorna storyboard tipado

**Tratamento de Erros Específico:**
- 404: Modelo não encontrado → tenta próximo
- 429: Quota excedida → tenta próximo (ou erro se último)
- 401: Autenticação → erro imediato
- JSON inválido → erro descritivo
- Estrutura incompleta → erro descritivo

---

## 🔒 Segurança e Ofuscação

### Medidas Implementadas

#### 1. **Ofuscação de Código**

**Variáveis e Funções:**
- `getApiKey` → `_a1`
- `getAI` → `_a3`
- `ai` → `_a2`
- `currentApiKey` → `_k2`
- `localStorage key` → `'gemini_api_key'` → `'_k1'`

**Objetivo:**
- Dificultar identificação de funções críticas
- Tornar engenharia reversa mais difícil
- Reduzir exposição de lógica de negócio

#### 2. **Remoção de Logs**

Todos os `console.log`, `console.warn`, `console.error` foram removidos do código de produção para:
- Não expor informações sensíveis
- Reduzir footprint do código
- Dificultar debugging por terceiros

#### 3. **Minificação**

Configurado no `vite.config.ts`:
```typescript
build: {
  minify: 'esbuild',
  target: 'es2015',
  rollupOptions: {
    output: {
      compact: true
    }
  }
}
```

**Resultado:**
- Código comprimido
- Nomes de variáveis minificados
- Espaços removidos
- Comentários removidos

#### 4. **Armazenamento Local**

API Key armazenada apenas no localStorage do navegador:
- Não é enviada para servidor externo
- Fica apenas no cliente
- Usuário tem controle total

### Limitações de Segurança

⚠️ **Importante:** Requisições HTTP do navegador **NÃO podem ser completamente escondidas**.

**O que pode ser interceptado:**
- Requisições via DevTools (Network tab)
- Proxies (Burp Suite, OWASP ZAP)
- Extensões do navegador
- Ferramentas de interceptação

**Recomendações para Produção:**
1. **Backend Proxy**: API Key no servidor, cliente faz requisições para seu backend
2. **Rate Limiting**: Limitar requisições por IP/usuário
3. **Validação no Servidor**: Sempre validar dados no backend
4. **HTTPS**: Usar sempre conexão criptografada

---

## ⚙️ Configurações e Build

### vite.config.ts

**Configurações Principais:**

```typescript
server: {
  port: 3000,
  host: '0.0.0.0'  // Permite acesso de outros dispositivos na rede
}
```

**Variáveis de Ambiente:**
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```
- Injeta variáveis de ambiente no código
- Permite API Key via .env.local

**Alias de Paths:**
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, '.')
  }
}
```
- Permite imports como `@/components/...`

**Build:**
- Minificação com esbuild
- Target ES2015 (compatibilidade)
- Output compacto

### tsconfig.json

**Configurações TypeScript:**
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Module Resolution: bundler
- Strict mode habilitado

### Scripts NPM

```json
{
  "dev": "vite",           // Desenvolvimento com HMR
  "build": "vite build",   // Build de produção
  "preview": "vite preview" // Preview do build
}
```

---

## 📝 Tipos e Interfaces

### types.ts

Centraliza todas as definições TypeScript do projeto.

#### Interfaces de Dados

**1. CommercialIdea**
```typescript
interface CommercialIdea {
  title: string;        // Título do comercial
  synopsis: string;     // Resumo narrativo
  visualHook: string;   // Cena chave
}
```

**2. CineAnalysisResult**
```typescript
interface CineAnalysisResult {
  cinematicPrompt: string;           // Prompt para geradores de imagem
  cameraAngles: string[];            // 3 sugestões de ângulos
  lightingSuggestions: string[];      // 3 sugestões de iluminação
  commercialIdeas: CommercialIdea[];  // 2 ideias comerciais
}
```

**3. SceneJsonPrompt**
```typescript
interface SceneJsonPrompt {
  positive: string;      // Prompt positivo (inglês)
  negative: string;      // Prompt negativo
  camera: string;        // Especificações da câmera
  aspect_ratio: string;  // Proporção (16:9, 2.35:1, etc)
}
```

**4. StoryboardScene**
```typescript
interface StoryboardScene {
  sceneHeader: string;        // EXT. RUA - NOITE
  visualDescription: string;   // Descrição em português
  shotType: string;           // Close-up, Wide Shot, etc
  jsonPrompt: SceneJsonPrompt; // Prompt técnico JSON
}
```

**5. StoryboardResult**
```typescript
interface StoryboardResult {
  title: string;              // Título cinematográfico
  logline: string;            // Resumo de uma frase
  scenes: StoryboardScene[];  // Array de cenas (5-20)
}
```

#### Enums

**AppState**
```typescript
enum AppState {
  IDLE = 'IDLE',           // Estado inicial
  ANALYZING = 'ANALYZING', // Processando
  SUCCESS = 'SUCCESS',     // Sucesso
  ERROR = 'ERROR'         // Erro
}
```

#### Types

**ActiveTab**
```typescript
type ActiveTab = 'image' | 'story';
```

---

## 🎨 Design System

### Cores (Tailwind Custom)

Definidas no `index.html`:

```javascript
cinema: {
  900: '#0a0a0a',  // Background principal (quase preto)
  800: '#171717',  // Cards e containers
  700: '#262626',  // Bordas e divisores
  accent: '#f59e0b' // Cor de destaque (Amber 500)
}
```

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 600, 700
- **Uso**: 
  - Títulos: font-bold
  - Corpo: font-normal
  - Destaques: font-semibold

### Componentes Visuais

- **Cards**: `bg-cinema-800`, `border-cinema-700`, `rounded-xl`
- **Botões**: `bg-cinema-accent`, hover states
- **Inputs**: `bg-cinema-900`, focus com `border-cinema-accent`
- **Scrollbar**: Customizada (escura)

---

## 🚀 Como Funciona Internamente

### 1. Inicialização

```
index.html
  ↓
index.tsx (ReactDOM.createRoot)
  ↓
App.tsx
  ↓
useEffect verifica API Key
  ↓
Mostra ApiKeyScreen OU Interface Principal
```

### 2. Análise de Imagem

```
Usuário faz upload
  ↓
ImageUploader converte para Base64
  ↓
App.tsx chama handleImageSelected
  ↓
geminiService.analyzeImageForCinema()
  ↓
  ├─ Detecta tipo de mídia
  ├─ Cria prompt especializado
  ├─ Define JSON Schema
  ├─ Tenta modelos (fallback)
  └─ Retorna CineAnalysisResult
  ↓
App.tsx atualiza estado
  ↓
AnalysisResult.tsx renderiza resultados
```

### 3. Geração de Storyboard

```
Usuário digita história
  ↓
StoryInput.tsx valida (min 10 chars)
  ↓
App.tsx chama handleStorySubmit
  ↓
geminiService.generateStoryboardFromText()
  ↓
  ├─ Valida tamanho (max 8000)
  ├─ Prepara contexto visual (se houver)
  ├─ Cria prompt detalhado
  ├─ Define schema complexo
  ├─ Tenta modelos (fallback)
  ├─ Valida estrutura completa
  └─ Retorna StoryboardResult
  ↓
App.tsx atualiza estado
  ↓
StoryboardResult.tsx renderiza storyboard
```

### 4. Tratamento de Erros

```
Erro ocorre
  ↓
Catch block captura
  ↓
Identifica tipo de erro:
  ├─ 404 → Tenta próximo modelo
  ├─ 429 → Tenta próximo (ou erro se último)
  ├─ 401 → Erro de autenticação
  ├─ JSON inválido → Erro descritivo
  └─ Outros → Propaga erro
  ↓
App.tsx recebe erro
  ↓
Atualiza estado para ERROR
  ↓
Exibe mensagem amigável
```

---

## 📊 Fluxo de Dados

### Estado Global (App.tsx)

```
hasApiKeyConfigured
  ↓
  ├─ false → ApiKeyScreen
  └─ true → Interface Principal
       ↓
       activeTab
         ↓
         ├─ 'image' → ImageUploader
         │              ↓
         │              currentImage (Base64)
         │              ↓
         │              imageResult (CineAnalysisResult)
         │
         └─ 'story' → StoryInput
                        ↓
                        storyResult (StoryboardResult)
                        ↓
                        (usa currentImage + imageResult como contexto)
```

### Comunicação Componente ↔ Serviço

```
Componente (UI)
  ↓
  Chama função do serviço
  ↓
Serviço (geminiService.ts)
  ↓
  Processa e chama API
  ↓
  Retorna dados tipados
  ↓
Componente recebe e atualiza UI
```

---

## 🔧 Melhorias e Otimizações Implementadas

### 1. **Fallback de Modelos**

Sistema robusto que tenta múltiplos modelos automaticamente:
- Se um modelo falha (404), tenta o próximo
- Se quota excedida (429), tenta outro modelo
- Garante maior disponibilidade

### 2. **Validação em Múltiplas Camadas**

- **Frontend**: Validação de entrada (tamanho, formato)
- **Serviço**: Validação de estrutura de resposta
- **API**: Validação via JSON Schema

### 3. **Lazy Loading**

```typescript
const { GoogleGenAI } = await import("@google/genai");
```
- Módulo só é carregado quando necessário
- Reduz bundle inicial

### 4. **Memoização**

```typescript
const handleImageSelected = useCallback(async (...) => {
  // ...
}, []);
```
- Evita recriação de funções
- Reduz re-renders desnecessários

### 5. **Error Recovery**

- Múltiplas tentativas com diferentes modelos
- Mensagens de erro descritivas
- Feedback visual claro

---

## 📚 Conceitos Técnicos Aplicados

### 1. **JSON Schema Validation**

O Gemini AI suporta validação de resposta via JSON Schema:

```typescript
config: {
  responseMimeType: "application/json",
  responseSchema: analysisSchema,
  temperature: 0.7
}
```

**Vantagens:**
- Garante estrutura correta da resposta
- Reduz necessidade de validação manual
- Type-safe responses

### 2. **Multimodal AI**

O Gemini suporta múltiplos tipos de input simultaneamente:

```typescript
contents: {
  parts: [
    { inlineData: { mimeType, data } },  // Imagem
    { text: promptText }                  // Texto
  ]
}
```

### 3. **Base64 Encoding**

Imagens/vídeos são convertidos para Base64:
- Permite enviar binários via JSON
- Não requer upload para servidor
- Processamento direto no cliente

### 4. **FileReader API**

```typescript
reader.readAsDataURL(file);
```
- API nativa do navegador
- Converte arquivo para Base64
- Assíncrono e não-bloqueante

### 5. **TypeScript Enums**

```typescript
enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  // ...
}
```

**Vantagens:**
- Type-safe
- Autocomplete
- Refatoração segura

---

## 🎯 Decisões de Design

### Por que React?

- **Ecosistema maduro**: Muitas bibliotecas e recursos
- **Performance**: Virtual DOM eficiente
- **Developer Experience**: Hooks, TypeScript, ferramentas
- **Comunidade**: Grande suporte e documentação

### Por que Vite?

- **Velocidade**: Build extremamente rápido
- **HMR**: Hot reload instantâneo
- **Moderno**: Suporte nativo a ES modules
- **Simples**: Configuração mínima

### Por que TypeScript?

- **Type Safety**: Erros detectados antes de executar
- **Documentação**: Tipos servem como documentação
- **Refatoração**: Mudanças seguras em todo o código
- **Autocomplete**: IDE sugere métodos e propriedades

### Por que Tailwind CSS?

- **Utility-First**: Estilização rápida
- **Consistência**: Design system unificado
- **Performance**: Apenas classes usadas são incluídas
- **Customização**: Fácil criar tema customizado

### Por que Google Gemini?

- **Multimodal**: Suporta imagem + texto
- **JSON Schema**: Validação de resposta
- **Múltiplos Modelos**: Flash (rápido) e Pro (preciso)
- **API Moderna**: SDK TypeScript nativo

---

## 🐛 Debugging e Troubleshooting

### Problemas Comuns

**1. API Key não funciona**
- Verificar se está correta
- Verificar se tem acesso aos modelos
- Verificar quota disponível

**2. Erro 404 (Modelo não encontrado)**
- Sistema tenta automaticamente outros modelos
- Verificar lista de modelos disponíveis na API

**3. Erro 429 (Quota excedida)**
- Aguardar alguns minutos
- Verificar uso em https://ai.dev/usage
- Considerar upgrade de plano

**4. Resposta vazia**
- História muito longa (tentar encurtar)
- Prompt muito complexo
- Tentar novamente

### Ferramentas de Debug

**Desenvolvimento:**
- React DevTools
- Chrome DevTools
- Network tab para ver requisições

**Produção:**
- Logs removidos (ofuscação)
- Mensagens de erro amigáveis
- Validação de estrutura

---

## 📈 Próximos Passos e Melhorias

### Possíveis Melhorias

1. **Backend Proxy**
   - API Key no servidor
   - Rate limiting
   - Cache de respostas

2. **Histórico**
   - Salvar análises anteriores
   - Exportar storyboards
   - Compartilhamento

3. **Mais Formatos**
   - Exportar para PDF
   - Exportar para Final Draft
   - Integração com ferramentas de edição

4. **Otimizações**
   - Cache de modelos
   - Compressão de imagens antes do upload
   - Lazy loading de componentes

5. **UX**
   - Animações mais suaves
   - Modo escuro/claro
   - Internacionalização (i18n)

---

## 📖 Conclusão

O **CineVision AI** é uma aplicação moderna e bem estruturada que demonstra:

✅ **Arquitetura sólida**: Separação clara de responsabilidades
✅ **Type Safety**: TypeScript em todo o código
✅ **Error Handling**: Tratamento robusto de erros
✅ **UX Polida**: Interface intuitiva e responsiva
✅ **Performance**: Otimizações e lazy loading
✅ **Segurança**: Ofuscação e validações

O projeto serve como excelente exemplo de:
- Integração com APIs de IA
- Uso de React moderno (hooks)
- TypeScript em produção
- Design system consistente
- Tratamento de erros robusto

---

**Versão do Documento**: 1.1
**Última Atualização**: 2025
**Autor**: Documentação Técnica CineVision AI

