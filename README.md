# MapEncode
Simple Javascript functions to encode and decode text using arbirtary character sets.

While working on a recent project I found myself wishing for a simple way to encode Base64-like strings using arbitrary sets of characters rather than the standard set. MapEncode was written to achieve this result.

With it you can encode any ASCII or Unicode string using a character map you specify. Below are a few examples.

**English**

```
var string = "smiling girl";
var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
var encoded = MapEncode(string, map);
var decoded = MapDecode(encoded, map);

Output
encoded: "LPRXECHBYLWACNHXKCKBC";
decoded: "smiling girl";
```

**Simplified Chinese**
```
var string = "微笑着的女孩";
var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
var encoded = MapEncode(string, map);
var decoded = MapDecode(encoded, map);

Output
encoded: "CGKJONGXJGVHYZTTZEEFB-";
decoded: "微笑着的女孩";
```

**Mixed (Japanese and Hebrew)**
```
var string = "笑顔の女の子 ילדה מחייכת"
var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
var encoded = MapEncode(string, map);
var decoded = MapDecode(encoded, map);

Output
encoded: "TPUMQYYBJLWDUCGEAEEFB-GB-PFYCORVEAAEVD-GB-UFTCOXVEAFEVNBHARCPB-";
decoded: "笑顔の女の子 ילדה מחייכת"
```

**Numeric map 1**
```
var string = "smiling girl";
var map = "0123456789-";
var encoded = MapEncode(string, map);
var decoded = MapDecode(encoded, map);

Output
encoded: "51563765171646950015171056463";
decoded: "smiling girl";
```

**Numeric map 2 (different character order)**
```
var string = "smiling girl";
var map = "4602795831-";
var encoded = MapEncode(string, map);
var decoded = MapDecode(encoded, map);

Output
encoded: "96952859686575194469686495752";
decoded: "smiling girl";
```

**Note 1**
MapEncode and MapDecode use the last character in a set as a trigger to toggle between one byte and two byte encoding. Note that the maps above inclue a "-" char at the end. This was added so that the full character set could be used for encoding. If it had been omitted, the letter "Z" would have been used as the toggle trigger.

**Note 2**
MapEncode uses a completely different algorithm than standard base64 functions, so even if you use the standard set of characters, you will get different output. The two are not interchangeable.

**Note 3**
MapEncode requires encode/decode maps to be 3 characters or longer

**An interactive demo can be found [here](http://nowser.net/MapEncode/index.html)**


