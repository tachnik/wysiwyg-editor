import * as React from 'react';
import { connect } from 'react-redux';
import { State as StateClass, LinkedList } from '../tsClasses'
import Line from './Line'

interface Props {
    lines: LinkedList
}

export class Body extends React.Component<Props> {

    /**
     * outputs line type
     * @param line
     * @return type of line, ex: header, linebreak, list
     */
    getLineType(line: string): string {
        if(!line) return null
        // if object is empty break line
        if(line.length == 0) return 'LINE-BREAK'
        // special case if its a ordered list
        if(parseInt(line.charAt(0)) && line.charAt(1) == '.' && line.charAt(2) == ' ') return 'ORDERED_LIST'
        // returns string between index 0 and first space
        return line.substring(0,line.indexOf(' '))
    }

    render() {
        const lines: LinkedList = new LinkedList()
        let cur = this.props.lines.top
        let i:number = 0
        if(!cur || !cur.value) return <div className="container text-container border"><pre className="my-2">No text</pre></div>
        while(cur) {
            let line = cur.value
            const lineType = this.getLineType(line)
            let subIndex:number
            let listItems: any[] = []
            switch(lineType) {
                case '#':
                    lines.addElement(<h1 key={i++} className="border-bottom py-1 mb-3"><Line line={ line.substring(1) } /></h1>)
                    break
    
                case '##':
                    lines.addElement(<h2 key={i++} className="border-bottom py-1 mb-3"><Line line={ line.substring(2) } /></h2>)
                    break
    
                case '###':
                    lines.addElement(<h3 key={i++}><Line line={ line.substring(3) } /></h3>)
                    break

                case '####':
                    lines.addElement(<h4 key={i++}><Line line={ line.substring(4) } /></h4>)
                    break

                case '#####':
                    lines.addElement(<h5 key={i++}><Line line={ line.substring(5) } /></h5>)
                    break

                case '######':
                    lines.addElement(<h6 key={i++}><Line line={ line.substring(6) } /></h6>)
                    break
                    
                case '*':
                    listItems = []
                    subIndex = 0
                    while(this.getLineType(line) == '*') {
                        listItems.push(<li key={ i + '_' + subIndex++ }><Line line={ line.substring(1) } /></li>)
                        if(!cur.next || this.getLineType(cur.next.value) != '*') break
                        cur = cur.next
                        line = cur.value
                    }
                    lines.addElement(<ul className="my-3" key={i++}>{ listItems }</ul>)
                    break
    
                case 'ORDERED_LIST':
                    listItems = []
                    subIndex = 0
                    while(this.getLineType(line) == 'ORDERED_LIST') {
                        listItems.push(<li key={ i + '_' + subIndex++ }><Line line={ line.substring(2) } /></li>)
                        if(this.getLineType(cur.next.value) != '*') break
                        cur = cur.next
                        line = cur.value
                    }
                    lines.addElement(<ol className="my-3" key={i++}>{ listItems }</ol>)
                    break
    
                case 'LINE-BREAK':
                    lines.addElement(<br/>)
                    break
                
                default:
                    lines.addElement(<p key={i++}><Line line={ line } /></p>)
                    break
            }
            cur = cur.next 
        }
        return (
            <React.Fragment>
                <div className='container border text-container text-left py-2'>{ lines.getElement() }</div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: StateClass) => ({
    ...state
})
  
const mapDispatchToProps = (dispatch: any) => ({

})
  
export default connect(mapStateToProps, mapDispatchToProps)(Body);