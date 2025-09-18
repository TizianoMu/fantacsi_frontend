# frontend/Dockerfile
FROM node:22-alpine as builder

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia package.json e package-lock.json e installa le dipendenze
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Comandi per la build di produzione (commentati per lo sviluppo)
# RUN npm run build

# Espone la porta su cui gira il server di sviluppo Vite/React
EXPOSE 3000

# Comando di default per avviare l'applicazione (server di sviluppo React)
# Aggiunto -- --host 0.0.0.0 per ascoltare su tutte le interfacce
CMD ["npm", "start", "--", "--host", "0.0.0.0"]