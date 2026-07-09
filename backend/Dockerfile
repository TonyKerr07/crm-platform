# ── Estágio 1: Build ──────────────────────────────────────────
FROM maven:3.9.7-eclipse-temurin-21-alpine AS build

WORKDIR /app

# CORREÇÃO: Copia o pom.xml do backend (agora standalone — sem pai externo)
COPY pom.xml .

# Baixa as dependências primeiro (cache do Docker — se o pom.xml não mudar,
# essa etapa é pulada nas próximas vezes, deixando o build muito mais rápido)
RUN mvn dependency:go-offline -q

# Copia o código fonte e compila
COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true -q

# ── Estágio 2: Runtime ────────────────────────────────────────
# Imagem mínima para rodar o JAR — muito menor que a de build
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Segurança: roda como usuário sem privilégios root
RUN addgroup -S crm && adduser -S crm -G crm
USER crm

# Copia só o JAR compilado do estágio anterior
COPY --from=build /app/target/*.jar app.jar

ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport"
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
