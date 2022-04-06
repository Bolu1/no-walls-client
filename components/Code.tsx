import React from 'react'
import Highlight, {defaultProps} from "prism-react-renderer"
import theme from 'prism-react-renderer/themes/dracula'

export const Code = ({language, code, ...props}) =>{

        const exampleCode:string = `
        (function someDemo() {
        var test = "Hello World!";
        console.log(test);
        })();

        return () => <App />;
        `;

    return(
        <Highlight
        {...defaultProps}
        code={code}
        language= {language}
        theme={theme}
        >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
         
         <pre  className={className || "jsx"} >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
        )}
        </Highlight>
    )
}