import React, { useState } from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { loadFonts } from "~/utils/fonts"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import { useStyletron } from "baseui"
import { SAMPLE_TEMPLATES } from "~/constants/editor"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import useEditorType from "~/hooks/useEditorType"
import { loadVideoEditorAssets } from "~/utils/video"
import { Button, SHAPE } from "baseui/button"
import { StatefulTooltip } from "baseui/tooltip"

const Templates = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setCurrentScene, currentScene } = useDesignEditorContext()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const addTemplate = () => {
    inputFileRef.current?.click()
  }

  function isJsonString(strs: string) {
    try {
      JSON.parse(strs)
    } catch (e) {
      return false
    }
    return true
  }
  const [template, setTemplate] = useState(SAMPLE_TEMPLATES)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (res) => {
        const result = res.target!.result as string
        const design = JSON.parse(result)
        console.log("template json =====>", result)
        const stringJson = result.toString()
        const checkJson = isJsonString(stringJson)
        if (checkJson) {
          let scenes = design.scenes
          // const newData = JSON.parse(scenes.toString())
          delete design["scenes"]
          design["layers"] = scenes[0].layers

          console.log("new added design", design)
          template.push(design)
          setTemplate([...template]);
       
        }

        // handleImportTemplate(design)
      }
      reader.onerror = (err) => {
        console.log(err)
      }

      reader.readAsText(file)
    }
  }

  const loadTemplate = React.useCallback(
    async (template: any) => {
      if (editor) {
        const fonts: any[] = []
        template.layers.forEach((object: any) => {
          if (object.type === "StaticText" || object.type === "DynamicText") {
            fonts.push({
              name: object.fontFamily,
              url: object.fontURL,
              options: { style: "normal", weight: 400 },
            })
          }
        })
        const filteredFonts = fonts.filter((f) => !!f.url)
        if (filteredFonts.length > 0) {
          await loadFonts(filteredFonts)
        }

        setCurrentScene({ ...template, id: currentScene?.id })
      }
    },
    [editor, currentScene]
  )

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Templatessss</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <div style={{ padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
            {template.map((item, index) => {
              return <ImageItem onClick={() => loadTemplate(item)} key={index} preview={`${item.preview}?tr=w-320`} />
            })}
          </div>
        </div>
      </Scrollable>
      {/* Adding the functionality to add more templates */}

      <StatefulTooltip
        showArrow={true}
        overrides={{
          Inner: {
            style: {
              backgroundColor: "#ffffff",
              color: "black",
            },
          },
        }}
        content={() => <Block backgroundColor="#ffffff">Upload template in JSON format</Block>}
      >
        <Block>
          <div style={{ padding: "10px 5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {" "}
            <Button onClick={() => addTemplate()} shape={SHAPE.pill}>
              Add templates
            </Button>
            <input
              multiple={false}
              onChange={handleFileInput}
              type="file"
              id="file"
              ref={inputFileRef}
              style={{ display: "none" }}
            />
          </div>
        </Block>
      </StatefulTooltip>
    </Block>
  )
}

const ImageItem = ({ preview, onClick }: { preview: any; onClick?: (option: any) => void }) => {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        "::before:hover": {
          opacity: 1,
        },
      })}
    >
      <div
        className={css({
          backgroundImage: `linear-gradient(to bottom,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.006) 8.1%,
          rgba(0, 0, 0, 0.022) 15.5%,
          rgba(0, 0, 0, 0.047) 22.5%,
          rgba(0, 0, 0, 0.079) 29%,
          rgba(0, 0, 0, 0.117) 35.3%,
          rgba(0, 0, 0, 0.158) 41.2%,
          rgba(0, 0, 0, 0.203) 47.1%,
          rgba(0, 0, 0, 0.247) 52.9%,
          rgba(0, 0, 0, 0.292) 58.8%,
          rgba(0, 0, 0, 0.333) 64.7%,
          rgba(0, 0, 0, 0.371) 71%,
          rgba(0, 0, 0, 0.403) 77.5%,
          rgba(0, 0, 0, 0.428) 84.5%,
          rgba(0, 0, 0, 0.444) 91.9%,
          rgba(0, 0, 0, 0.45) 100%)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          height: "100%",
          width: "100%",
          ":hover": {
            opacity: 1,
          },
        })}
      />
      <img
        src={preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  )
}

export default Templates
