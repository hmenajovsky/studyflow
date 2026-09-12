# Analyse des études cliniques par institut et par pays
# Source : base SQLite StudyFlow (prisma/dev.db)
# Usage : depuis la racine du projet
#   Rscript analyses/instituts/analyse.R

user_lib <- file.path(Sys.getenv("USERPROFILE"), ".R", "library")
if (dir.exists(user_lib)) .libPaths(c(user_lib, .libPaths()))

suppressPackageStartupMessages(library(RSQLite))

DB_PATH <- "prisma/dev.db"
OUT_DIR <- "analyses/instituts"
OUT_PNG <- file.path(OUT_DIR, "etudes_par_institut_et_pays.png")

if (!dir.exists(OUT_DIR)) dir.create(OUT_DIR, recursive = TRUE)

con <- dbConnect(SQLite(), DB_PATH)
on.exit(dbDisconnect(con))

# Études par institut (LEFT JOIN : inclut un institut sans étude)
by_institute <- dbGetQuery(
  con,
  "SELECT ri.name AS institut,
          ri.country AS pays,
          COUNT(s.id) AS n_etudes
     FROM ResearchInstitute ri
     LEFT JOIN Study s ON s.instituteId = ri.id
    GROUP BY ri.id
    ORDER BY n_etudes DESC, institut"
)

# Études par pays
by_country <- dbGetQuery(
  con,
  "SELECT ri.country AS pays,
          COUNT(s.id) AS n_etudes
     FROM ResearchInstitute ri
     LEFT JOIN Study s ON s.instituteId = ri.id
    GROUP BY ri.country
    ORDER BY n_etudes DESC, pays"
)

institutes <- nrow(by_institute)
countries <- nrow(by_country)
studies <- sum(by_institute$n_etudes)

cat("=== Synthèse des études cliniques ===\n")
cat(sprintf(
  "Total : %d études, %d instituts, %d pays.\n\n",
  studies, institutes, countries
))

cat("--- Études par institut ---\n")
print(by_institute, row.names = FALSE)
cat("\n")

cat("--- Études par pays ---\n")
print(by_country, row.names = FALSE)
cat("\n")

# Visualisation : deux barplots horizontaux côte à côte
cn <- 0.8
labels_all <- c(by_institute$institut, by_country$pays)
max_label <- labels_all[which.max(nchar(labels_all))]
max_n <- max(by_institute$n_etudes, by_country$n_etudes)

png(OUT_PNG, width = 1500, height = 560, res = 110)

# Marge gauche ajustée au plus long libellé pour éviter toute troncature
left_lines <- ceiling(
  (strwidth(max_label, cex = cn, units = "inches") + par("csi") * 1.5) /
    par("csi")
)
par(mfrow = c(1, 2), mar = c(4, left_lines, 3, 2), mgp = c(2.2, 0.7, 0))

barplot(
  by_institute$n_etudes,
  names.arg = by_institute$institut,
  horiz = TRUE,
  las = 1,
  border = NA,
  col = "#0f766e",
  cex.names = cn,
  xlab = "Nombre d'études",
  main = "Études par institut",
  xlim = c(0, max_n + 1)
)
nz <- by_institute$n_etudes > 0
text(by_institute$n_etudes[nz], which(nz),
  by_institute$n_etudes[nz], pos = 4, cex = 0.9
)

barplot(
  by_country$n_etudes,
  names.arg = by_country$pays,
  horiz = TRUE,
  las = 1,
  border = NA,
  col = "#b45309",
  cex.names = cn,
  xlab = "Nombre d'études",
  main = "Études par pays",
  xlim = c(0, max_n + 1)
)
nz <- by_country$n_etudes > 0
text(by_country$n_etudes[nz], which(nz),
  by_country$n_etudes[nz], pos = 4, cex = 0.9
)

dev.off()

cat(sprintf("Graphique sauvegardé : %s\n", OUT_PNG))