"""Une toile claire façon tissu, 1080 x 960, pour le fond des animations de l'assiette.
Calquée sur l'image de référence de Mohamed : blanc en haut au centre (~252), plus gris sur
les bords (~226), un grain de sergé en diagonale et un peu de bruit. Dessinée ici, donc à nous."""
import sys
import numpy as np
from PIL import Image, ImageFilter

W, H = 1080, 960
rng = np.random.default_rng(20260925)
y, x = np.mgrid[0:H, 0:W].astype(np.float64)

# la lumière : un halo doux en haut au centre
r = np.sqrt((x - 540.0) ** 2 + ((y + 140.0) * 1.2) ** 2)
lum = 252.0 - 27.0 * np.clip((r - 160.0) / 1050.0, 0.0, 1.0) ** 0.85

# le sergé : des lignes fines en diagonale, un tissage plus faible dans l'autre sens
irreg = 0.72 + 0.28 * np.sin(2 * np.pi * y / 23.0 + 0.7) * np.sin(2 * np.pi * x / 31.0)
serge = 6.2 * np.sin(2 * np.pi * (x + y) / 6.5) * irreg
trame = 2.4 * np.sin(2 * np.pi * (x - y) / 9.5)

# le grain et les marbrures
grain = rng.normal(0.0, 4.0, size=(H, W))
petit = rng.normal(0.0, 1.0, size=(H // 24 + 2, W // 24 + 2))
marbre = np.asarray(Image.fromarray(((petit - petit.min()) / (petit.max() - petit.min()) * 255).astype(np.uint8))
                    .resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(18))).astype(np.float64)
marbre = (marbre - marbre.mean()) / (marbre.std() + 1e-6) * 2.2

v = np.clip(lum + serge + trame + grain + marbre, 0, 255)
rgb = np.stack([v, v, np.clip(v - 2.0, 0, 255)], axis=-1).astype(np.uint8)
out = sys.argv[1]
Image.fromarray(rgb, "RGB").save(out, quality=92, subsampling=0)
g = v
print("fichier", out)
print("moyenne", round(g.mean(), 1), "haut-centre", round(g[:60, 510:570].mean(), 1), "bord", round(g[-60:, :60].mean(), 1),
      "écart local", round(g[400:440, 500:540].std(), 2))
