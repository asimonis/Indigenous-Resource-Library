# Indigenous Science & Education Resource Library — Quarto prototype

## Open in RStudio

1. Unzip the folder to a location on your computer.
2. In RStudio, open `index.qmd` or open the folder as a project (File > New Project > Existing Directory).
3. Ensure Quarto and R are installed. If needed, run `install.packages("knitr")` in R.
4. In the RStudio Terminal, run `quarto preview` from this folder, or open `library.qmd` and click **Render**.
5. To create the full site without preview, run `quarto render`.

## Update resources

Edit `resources.csv` in Excel or RStudio, retaining its column headings. Save it as **UTF-8 CSV**. Render the site again; the resource library is generated from the CSV automatically.

- `Topics`: currently one primary topic per resource; additional tags could be supported later.
- `Sharing status` and `Curator's notes`: retained for editorial use but **not displayed publicly**.
- `Link`: only http(s) URLs are rendered as clickable links.
- Published materials are linked at their original sources; no PDFs are redistributed.

## Publishing later

Once reviewed, put the project in a GitHub repository. Run `quarto render` and publish with `quarto publish gh-pages` (following Quarto's GitHub Pages setup prompts). Review all text, links, and permissions before publishing.

## Inventory cleanup

The original inventory was preserved conceptually with these changes: the typo `Calfiornia` was corrected to `California`; format labels were standardized; and the final row's YouTube URL was moved from `Sharing status` to `Link`. Other metadata is left for curatorial review. Missing descriptions, creators, and sharing permissions have not been invented.

This is a prototype, not an endorsement of every resource or confirmation of public sharing permissions.
