# MapEncode
Simple Javascript functions to encode and decode text using arbirtary character sets.

While working on a recent project I found myself wishing for a simple way to encode Basee64-like strings using arbitrary sets of characters rather than the standard set used in base 64. MapEncode was written to achieve this result.

With it you can encode any ASCII or Unicode string using a character map you specify. Below are a few examples.

----------------------------------------------
English
----------------------------------------------
var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
var src = "smiling girl";
var encoded = MapEncode(src, map);
var decoded = MapDecode(encoded, map);

Output:
encoded: "LPRXECHBYLWACNHXKCKBC"
decoded: "smiling girl"

----------------------------------------------
Simplified Chinese
----------------------------------------------
var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
var src = "微笑着的女孩";
var encoded = MapEncode(src, map);
var decoded = MapDecode(encoded, map);

Output:
encoded: "CGKJONGXJGVHYZTTZEEFB-"
decoded: "微笑着的女孩"

----------------------------------------------
Mixed (Greek, Arabic and Punjabi)
----------------------------------------------
var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
var src = "Χαμογελαστό κορίτσι فتاة مبتسمة ਮੁਸਕਰਾ ਲੜਕੀ";
var encoded = MapEncode(src, map);
var decoded = MapDecode(encoded, map);

Output:
encoded: "ZJZIUQGGRVBPBJUJGGNVBPZIUXGGWVBPAKUD-GB-SKNJUVGGBVBPSJUXGGLVBPB-GB-PJYFOXYEAHHVD-GB-TJWFOAZEARHVPFHLTCPB-GB-GWVSIKHEPXTWESIQHEPB-GB-KWWTIBGEPOVWD-"
decoded: "Χαμογελαστό κορίτσι فتاة مبتسمة ਮੁਸਕਰਾ ਲੜਕੀ"

----------------------------------------------
Numeric map
----------------------------------------------
var map = "0123456789-";
var src = "smiling girl";
var encoded = MapEncode(src, map);
var decoded = MapDecode(encoded, map);

Output:
encoded: "51563765171646950015171056463"
decoded: "smiling girl"


