<html>
<head>
  <title>{{title}}</title>
</head>
<body>
    <p>
        A test of the filters:
    </p>
    <ul>
        <li>The date ({{date}}) when formatted for the database: {{date|date(db)}}</li>
        <li>A title ({{title}}) filtered with title: {{title|title}}</li>
        <li>A word ({{word}}) capitalized: {{word|capitalize}}</li>
        <li>The same word in uppercase: {{word|upper}}</li>
        <li>an uppercase word ({{upper}}) lowercased: {{upper|lower}}</li>
        <li>a undefined variable with a default value: {{test|default('no value')}}</li>
        <li>An array joined: {{arr|join(',')}}</li>
        <li>An object JSON encoded: {{obj|json_encode}}</li>
        <li>A string of HTML escaped: {{html|escape}} </li>
    </ul>

</body>
</html>