{*
Base file that will be extended by another file.
*}
<html>
<head>
  <title>{{title}}</title>
</head>
<body>
  {+ content +}
    <p>this content should get overwritten</p>
  {+/ content +}
  {! 'footer' !}
</body>
</html>