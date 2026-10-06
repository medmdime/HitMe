"""La tête de Mark Haub, découpée dans son portrait officiel (université d'État du Kansas, annonce du 31 mai 2016 :
https://www.k-state.edu/today/announcement/?id=27810). Le portrait (200 x 300) est agrandi quatre fois, détouré en
local (`npx hyperframes@0.8.21 remove-background`, rien n'est envoyé à un service), puis coupé le long de la mâchoire :
ni col, ni costume. Les fichiers de brut/ et la tête restent sur la machine (le dépôt est public)."""
from PIL import Image, ImageChops, ImageDraw, ImageFilter

im = Image.open('brut/haub-2016-detoure.png').convert('RGBA')
# Le contour, dans l'image agrandie (800 x 1200) : tout ce qui est au-dessus des oreilles, puis la mâchoire.
CONTOUR = [(200, 0), (700, 0), (700, 400), (642, 400), (628, 455), (600, 490), (566, 528), (540, 574), (508, 606),
           (472, 626), (432, 632), (392, 624), (352, 596), (322, 556), (300, 508), (270, 458), (258, 400), (200, 400)]
masque = Image.new('L', im.size, 0)
ImageDraw.Draw(masque).polygon(CONTOUR, fill=255)
masque = masque.filter(ImageFilter.GaussianBlur(2.5))
r, g, b, a = im.split()
a = ImageChops.multiply(a, masque)
rgb = Image.merge('RGB', (r, g, b)).filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))
tete = Image.merge('RGBA', (*rgb.split(), a))
tete = tete.crop(a.point(lambda v: 255 if v > 12 else 0).getbbox())
tete.save('mark-haub.png', optimize=True)
print('tete', tete.size)
fond = Image.new('RGB', tete.size, (60, 60, 60))
fond.paste(tete, (0, 0), tete)
fond.save('brut/apercu-tete.jpg', quality=92)
