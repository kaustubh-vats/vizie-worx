import { useCallback, useEffect, useLayoutEffect, useRef, useState, React } from 'react';
import styles from '../css/App.module.css';
import '../css/common.css';
import MainTooltip from '../Tooltips/MainTooltip.jsx';
import PlayGround from '../PlayGround/Playground.jsx';
import { ComponentType, PositionType, ShapeType } from '../Utils/ConstUtils';
import { generateComponents, generateId, generateStyles, getComponentType, styleNumParser } from '../Utils/CommonUtils';
import ComponentTooltip from '../Tooltips/ComponentTooltip.jsx';
import { renderToString } from 'react-dom/server';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function App({
  componentListDefault,
  componentStyleDefault,
  defaultText,
  defaultButtonText,
  containerPadding,
  defaulImageSrc,
  onUpdateCode
}) {
  const getDefaultStackedRef = () => {
    let styleRef = 0;
    if(componentListDefault && componentListDefault.length > 0) {
      componentListDefault.forEach((comp) => {
        if(comp.positionType === PositionType.Locked) {
          styleRef++;
        }
      })
    }
    return styleRef;
  }
  const [mainStyles, setMainStyles] = useState({
    width: 450,
    height: 200,
    backgroundColor: '#FFFFFF',
    cornerRadius: 10,
    padding: containerPadding || undefined
  })
  const [componentList, setComponentList] = useState(componentListDefault || []);
  const [selectedElem, setSelectedElem] = useState(null);
  const [groupList, setGroupList] = useState([]);

  const wrapRef = useRef(null);
  const componentStylesRef = useRef(componentStyleDefault || {});
  const stackedContentRef = useRef(getDefaultStackedRef());
  const isDragging = useRef(false);
  const dragCoords = useRef({
    x: 0,
    y: 0
  });
  const currCompId = useRef(null);
  const currCompIdx = useRef(null);
  const tooltipRef = useRef(null);
  
  const onScale = useCallback((heightDelta, widthDelta) => {
    const elementClasslist = selectedElem && selectedElem.classList;
    if (elementClasslist) {
      const elemDataIdx = componentList.findIndex(comp => { return elementClasslist.contains(comp.vId); });
      if (elemDataIdx >= 0) {
        const currentElementId = componentList[elemDataIdx].vId;
        const styles = componentStylesRef.current[currentElementId];
        const height = styleNumParser(styles.height, selectedElem, 'height') + heightDelta + 'px';
        const width = styleNumParser(styles.width, selectedElem, 'width') + widthDelta + 'px';
        componentStylesRef.current[currentElementId] = {
          ...styles,
          height: height,
          width: width,
        }
        const compList = [...componentList];
        compList[elemDataIdx].updatedAt = Date.now();
        setComponentList(compList);
      }
    }
  }, [componentList, selectedElem]);

  const onRePosition = useCallback((xDelta, yDelta) => {
    const elementClasslist = selectedElem && selectedElem.classList;
    if (elementClasslist) {
      const elemDataIdx = componentList.findIndex(comp => { return elementClasslist.contains(comp.vId); });
      if (elemDataIdx >= 0) {
        const currentElementId = componentList[elemDataIdx].vId;
        const styles = componentStylesRef.current[currentElementId];
        if (componentList[elemDataIdx].positionType === PositionType.Stacked) {
          const marginY = styleNumParser(styles.marginTop) + yDelta + 'px';
          const marginX = styleNumParser(styles.marginLeft) + xDelta + 'px';
          componentStylesRef.current[currentElementId] = {
            ...styles,
            marginLeft: marginX,
            marginTop: marginY,
          }
        } else {
          const top = styleNumParser(styles.top) + yDelta + 'px';
          const left = styleNumParser(styles.left) + xDelta + 'px';
          componentStylesRef.current[currentElementId] = {
            ...styles,
            top: top,
            left: left,
          }

        }
        const compList = [...componentList];
        compList[elemDataIdx].updatedAt = Date.now();
        setComponentList(compList);
      }
    }
  }, [componentList, selectedElem]);

  const onDeleteComponent = useCallback(() => {
    const elementClasslist = selectedElem && selectedElem.classList;
    if (elementClasslist) {
      const elemDataIdx = componentList.findIndex(comp => { return elementClasslist.contains(comp.vId); });
      if (elemDataIdx >= 0) {
        const currentElementId = componentList[elemDataIdx].vId;
        if(componentList[elemDataIdx].positionType === PositionType.Locked) {
          stackedContentRef.current = stackedContentRef.current - 1;
        }
        delete componentStylesRef.current[currentElementId];
        const compList = [...componentList];
        compList.splice(elemDataIdx, 1);
        setComponentList(compList);
        setSelectedElem(null);
      }
    }
  }, [componentList, selectedElem]);

  const onCopyComponent = useCallback(() => {
    const elementClasslist = selectedElem && selectedElem.classList;
    if (elementClasslist) {
      const elemDataIdx = componentList.findIndex(comp => { return elementClasslist.contains(comp.vId); });
      if (elemDataIdx >= 0) {
        const currentElementId = componentList[elemDataIdx].vId;
        let style = componentStylesRef.current[currentElementId];
        const currCompType = componentList[elemDataIdx].componentType;
        const newUUID = generateId(currCompType);

        const compData = {
          ...componentList[elemDataIdx],
          vId: newUUID
        }

        if(componentList[elemDataIdx].positionType === PositionType.Locked) {
          stackedContentRef.current = stackedContentRef.current + 1;
          const top = styleNumParser(style.top) + 10 + 'px';
          const left = styleNumParser(style.left) + 10 + 'px';

          style = {
            ...style,
            top: top,
            left: left
          }
        }

        componentStylesRef.current[newUUID] = {
          ...style
        }
        const compList = [
          ...componentList
        ];
        compList.push(compData);
        setComponentList(compList);
      }
    }
  }, [componentList, selectedElem]);

  const onCreateRow = useCallback(() => {
    if(groupList && groupList.length > 0) {
      const groupType = getComponentType(groupList[0]);
      if(!groupType) {
        return;
      }
      const compData = groupList.map((elem) => {
        return componentList.findIndex((comp) => elem.classList.contains(comp.vId));
      });
      const children = compData.map((idx)=>componentList[idx]);

      const uuid = generateId(ComponentType.Row);
      componentStylesRef.current[uuid] = {
        display: 'flex',
        justifyContent: 'space-around',
        position: groupType,
        width: '100%'
      }
      let compList = [...componentList];
      compList = compList.filter((elem, index)=> {
        return !compData.includes(index)
      });
      
      if(groupType === PositionType.Locked){
        let styles = {};
        children.forEach((compData)=>{
          styles = componentStylesRef.current[compData.vId];
          styles.position = PositionType.Stacked;
          styles.top = undefined;
          styles.left = undefined;
        });
        componentStylesRef.current = {
          ...componentStylesRef.current,
          ...styles
        }
        stackedContentRef.current -= (groupList.length - 1);
        
        let cList = compList;
        cList = [
          ...cList.slice(0, stackedContentRef.current - 1),
          {
            vId: uuid,
            children: children,
            componentType: ComponentType.Row,
            positionType: groupType
          },
          ...cList.slice(stackedContentRef.current - 1)
        ]
        compList = cList;
      } else {
        let styles = {};
        children.forEach((compData)=>{
          styles = componentStylesRef.current[compData.vId];
          styles.position = PositionType.Stacked;
          styles.marginTop = undefined;
          styles.marginLeft = undefined;
        });
        componentStylesRef.current = {
          ...componentStylesRef.current,
          ...styles
        }
        compList.push({
          vId: uuid,
          children: children,
          componentType: ComponentType.Row,
          positionType: groupType
        })
      }
      setComponentList(compList);
    }
    setGroupList([]);
  }, [groupList, componentList]);

  useEffect(()=>{
    if(!selectedElem) {
      currCompId.current = null;
      currCompIdx.current = null;
    }
  }, [selectedElem]);

  useEffect(()=>{
    if(componentList && componentList.length > 0 && onUpdateCode) {
      onUpdateCode(
        generateStyles(mainStyles, componentStylesRef.current),
        renderToString(generateComponents(componentList, stackedContentRef.current))
      )
    }
  }, [componentList, componentStylesRef, mainStyles, stackedContentRef]);

  useIsomorphicLayoutEffect(()=>{
    const keyPressListener = (e) => {
      if(e?.key?.toLowerCase() === 'delete') {
        onDeleteComponent();
      }
    }
    const keyDownListener = (e) => {
      if(e.metaKey || e.ctrlKey) {
        if(e?.key?.toLowerCase() === 'c') {
          onCopyComponent();
        } else if(
          e?.key?.toLowerCase() === 'g'
          || e?.key?.toLowerCase() === 'r'
        ) {
          onCreateRow();
          if(groupList && groupList.length > 0){
            e.preventDefault();
          }
        } else if(e?.key?.toLowerCase() === 'arrowup') {
          onScale(-1, 0);
        } else if(e?.key?.toLowerCase() === 'arrowdown') {
          onScale(1, 0);
        } else if(e?.key?.toLowerCase() === 'arrowleft') {
          onScale(0, -1);
        } else if(e?.key?.toLowerCase() === 'arrowright') {
          onScale(0, 1);
        }
      } else if(tooltipRef && tooltipRef.current && tooltipRef.current.contains(e.target)) {
        return;
      } else if(e?.key?.toLowerCase() === 'arrowup') {
        onRePosition(0, -1);
      } else if(e?.key?.toLowerCase() === 'arrowdown') {
        onRePosition(0, 1);
      } else if(e?.key?.toLowerCase() === 'arrowleft') {
        onRePosition(-1, 0);
      } else if(e?.key?.toLowerCase() === 'arrowright') {
        onRePosition(1, 0);
      }
      if(selectedElem) {
        e.preventDefault();
      }
    }
    if(document && document.body) {
      document.body.addEventListener('keyup', keyPressListener);
      document.body.addEventListener('keydown', keyDownListener);
    }
    return () => {
      document.body.removeEventListener('keyup', keyPressListener);
      document.body.removeEventListener('keydown', keyDownListener);
    };
  }, [onDeleteComponent, onCopyComponent, onCreateRow, onRePosition, onScale, selectedElem, groupList, tooltipRef]);

  const onHeightChange = (height) => {
    setMainStyles({ ...mainStyles, height: height });
  }

  const onWidthChange = (width) => {
    setMainStyles({ ...mainStyles, width });
  }

  const onBackgroundColorChange = (background) => {
    setMainStyles({ ...mainStyles, backgroundColor: background });
  }

  const onCornerRadiusChange = (cornerRadius) => {
    setMainStyles({ ...mainStyles, cornerRadius: cornerRadius });
  }

  const onAddComponent = (componentType, shapeType) => {
    let currStyles = componentStylesRef.current;
    if (!currStyles) {
      currStyles.current = {};
    }
    const unqId = generateId(componentType);
    let componentData = {
      "vId": unqId,
      "componentType": componentType,
      "shapeType": shapeType,
    };
    if (componentType === ComponentType.Shape) {
      if (shapeType === ShapeType.Eclipse) {
        currStyles[unqId] = {
          borderRadius: "50%",
          backgroundColor: "#0AB6FF",
          height: "20px",
          width: "20px",
          position: PositionType.Locked,
          top: "0px",
          left: "0px",
        }
      } else {
        currStyles[unqId] = {
          borderRadius: "0px",
          backgroundColor: "#0AB6FF",
          height: "20px",
          width: "20px",
          position: PositionType.Locked,
          top: "0px",
          left: "0px",
        }
      }
      componentData.positionType = PositionType.Locked;
      stackedContentRef.current = stackedContentRef.current + 1;
    } else if (componentType === ComponentType.Button) {
      currStyles[unqId] = {
        borderRadius: "10px",
        backgroundColor: "#0AB6FF",
        color: "#ffffff",
        height: "auto",
        width: "auto",
        position: PositionType.Stacked,
        marginLeft: "10px",
        marginTop: "10px",
        cursor: "pointer",
        borderWidth: "0px",
        padding: "5px 10px",
        display: 'block',
      }
      componentData.text = defaultButtonText || defaultText || "Vizi Worx"
      componentData.positionType = PositionType.Stacked;
    } else if (componentType === ComponentType.Image) {
      currStyles[unqId] = {
        height: `100%`,
        width: `100%`,
        position: PositionType.Locked,
        top: "0px",
        left: "0px",
        objectFit: "cover",
        objectPosition: "center"
      }
      componentData.src = defaulImageSrc || "https://vizie-worx.kaustubhvats.in/images/bgDemo.png";
      componentData.positionType = PositionType.Locked;
      stackedContentRef.current = stackedContentRef.current + 1;
    } else if (componentType === ComponentType.Text) {
      currStyles[unqId] = {
        backgroundColor: "transparent",
        color: "#000000",
        height: "auto",
        width: "auto",
        position: PositionType.Stacked,
        marginLeft: "10px",
        marginTop: "10px"
      }
      componentData.text = defaultText || "VizieWorx Demo Text"
      componentData.positionType = PositionType.Stacked;
    }
    componentStylesRef.current = currStyles;
    if (componentData.positionType === PositionType.Stacked) {
      setComponentList([...componentList, componentData]);
    } else {
      let cList = componentList;
      cList = [
        ...cList.slice(0, stackedContentRef.current - 1),
        componentData,
        ...cList.slice(stackedContentRef.current - 1)
      ]
      setComponentList(cList);
    }
  }

  const onDragElemStart = (e) => {
    isDragging.current = true;
    dragCoords.current = {
      x: e.pageX,
      y: e.pageY
    }
  }
  const onDragElemEnd = (e) => {
    isDragging.current = false;
    dragCoords.current = {
      x: 0,
      y: 0
    }
  }
  const onDragElemMove = (e) => {
    if (isDragging.current) {
      const xDelta = e.pageX - dragCoords.current.x;
      const yDelta = e.pageY - dragCoords.current.y;
      dragCoords.current = {
        x: e.pageX,
        y: e.pageY
      }
      onRePosition(xDelta, yDelta);
    }
  }

  const onSetSelectedElem = (elem) => {
    if (elem !== selectedElem) {
      setSelectedElem(elem);
    }
  }

  const getCurrentElemCss = () => {
    if(selectedElem && selectedElem.classList) {
      const elemDataIdx = componentList.findIndex(comp => { return selectedElem.classList.contains(comp.vId); });
      if (elemDataIdx >= 0) {
        const currentElementId = componentList[elemDataIdx].vId;
        currCompId.current = currentElementId;
        currCompIdx.current = elemDataIdx;
        return componentStylesRef.current[currentElementId];
      }
    }
    return {};
  }

  const onCssChange = (style) => {
    if(!currCompId.current) return;
    const currStyles = {
      ...componentStylesRef.current[currCompId.current],
      ...style
    };
    componentStylesRef.current[currCompId.current] = currStyles;
    if(currCompIdx.current >= 0) {
      const compList = [...componentList];
      compList[currCompIdx.current].updatedAt = Date.now();
      setComponentList(compList);
    }
  }

  const getCurrComponentType = () => {
    if(currCompIdx.current != null && componentList[currCompIdx.current]) {
      const compType = componentList[currCompIdx.current].componentType;
      if(compType === ComponentType.Shape) {
        return componentList[currCompIdx.current].shapeType;
      }
      return compType;
    }
    return null;
  }

  const onCompChange = (type, value) => {
    if(!currCompId.current) return;
    if(currCompIdx.current >= 0) {
      const compList = [...componentList];
      compList[currCompIdx.current][type] = value;
      compList[currCompIdx.current].updatedAt = Date.now();
      setComponentList(compList);
    }
  }

  return (
    <div className={styles.App}>
      <main
        className={styles.vwx__main}
      >
        {selectedElem && <ComponentTooltip
          width={mainStyles.width}
          style={getCurrentElemCss()}
          onStyleChange={onCssChange}
          ref={tooltipRef}
          height={mainStyles.height}
          positionType={(currCompIdx.current != null && componentList[currCompIdx.current])? componentList[currCompIdx.current].positionType : null}
          componentType={getCurrComponentType()}
          onCompChange={onCompChange}
          compData={(currCompIdx.current != null && componentList[currCompIdx.current])? componentList[currCompIdx.current] : null}
        />}
        <div
          className="main__wrapper"
          ref={wrapRef}
        >
          <PlayGround
            selectedElem={selectedElem}
            setSelectedElem={onSetSelectedElem}
            onScale={onScale}
            onMouseMove={onDragElemMove}
            onMouseUp={onDragElemEnd}
            onDragElemStart={onDragElemStart}
            groupList={groupList}
            setGroupList={setGroupList}
          >
            <style>
              {
                generateStyles(mainStyles, componentStylesRef.current)
              }
            </style>
            {
              generateComponents(componentList, stackedContentRef.current)
            }
          </PlayGround>
        </div>
        <MainTooltip
          width={mainStyles.width}
          height={mainStyles.height}
          backgroundColor={mainStyles.backgroundColor}
          cornerRadius={mainStyles.cornerRadius}
          onColorChange={onBackgroundColorChange}
          onHeightChange={onHeightChange}
          onWidthChange={onWidthChange}
          onCornerRadiusChange={onCornerRadiusChange}
          onAddComponent={onAddComponent}
          onClick={() => onSetSelectedElem(null)}
        />
      </main>
    </div>
  );
}

export default App;
