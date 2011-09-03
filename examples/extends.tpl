{# 'base' #}
{= title 'The title of the page' =}
{= var1 'some random text' =}
{= var2 354 =}
{+ content +}
  <p>{{test3.some.nested.var}}</p>
  <P>
    {@ if test @}
        test defined
    {e} 
        test not defined
    {@/ if @}
  </p>
  <p>
    {@ if test && test2>0 @}
        {{compoundIf}}
    {@/ if @}
  </p>
  <ul>
    {@ each testEach1 @}
        <li>{{item}}</li>
    {@/ each @}
  </ul>
  <ul>
    {@ each testEach2 @}
        <li>{{key}}, {{item}}</li>
    {@/ each @}
  </ul>
  <p>The value of the assign at the top of the template is {{var1}}</p>
  <p>And the second one was {{var2}}</p>
{+/ content +}