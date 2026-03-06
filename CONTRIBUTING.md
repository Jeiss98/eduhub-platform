# Guía de contribución — EduHub Platform

## Flujo de trabajo con Git

```
main          → rama principal, siempre estable
dev           → integración de features
feature/xxx   → trabajo individual por funcionalidad
hotfix/xxx    → correcciones urgentes sobre main
```

### Clonar e iniciar
```bash
git clone https://github.com/TU_USUARIO/eduhub-platform.git
cd eduhub-platform
git checkout -b feature/tu-nombre-funcionalidad
```

### Commits
Usa el formato:  `tipo(alcance): descripción corta`

| Tipo     | Cuándo usarlo                     |
|----------|-----------------------------------|
| feat     | Nueva funcionalidad               |
| fix      | Corrección de bug                 |
| docs     | Cambios en documentación          |
| style    | Formato, sin cambios de lógica    |
| refactor | Refactorización de código         |
| db       | Cambios en scripts SQL            |

**Ejemplos:**
```
feat(auth): agregar login con JWT
db(usuarios): agregar campo avatar_url
fix(tareas): corregir query de tareas vencidas
docs(readme): actualizar instrucciones de setup
```

### Pull Request
1. Haz push de tu rama: `git push origin feature/mi-feature`
2. Abre un PR hacia `dev` en GitHub
3. Asigna al menos un revisor del equipo
4. Espera aprobación antes de hacer merge

## Convenciones de código

- **SQL**: nombres de tablas en `snake_case`, IDs específicos por tabla (`id_usuario`, `id_proyecto`, etc.)
- **HTML/CSS**: clases en `kebab-case`
- **JavaScript/React**: componentes en `PascalCase`, funciones en `camelCase`
- Comentar bloques complejos en español
