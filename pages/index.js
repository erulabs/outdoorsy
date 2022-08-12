import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/future/image'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend'
import { Grid } from 'gridjs-react'
import styles from '../styles/Home.module.css'

const apiRequest = async (path = '/', opts = {}) => {
  if (!opts.headers) opts.headers = {}
  const res = await window.fetch(`/api${path}`, opts)
  let json = {}
  try {
    json = await res.json()
  } catch (err) {
    console.error('failed to parse json from ', path)
  }
  return { status: res?.status || 500, headers: res?.headers, json, res }
}

function DroppableZone({ children, toast, fetch }) {
  const [_collectedProps, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: async item => {
      const formData = new window.FormData()
      formData.append('file', item.files[0])
      const { status, json } = await apiRequest('/upload', {
        method: 'POST',
        body: formData,
        form: true,
      })
      if (status !== 200) {
        const subMsg = (json && json.error) || status
        toast(`Error uploading file! 😔 ${subMsg}`)
      } else {
        toast('File uploaded 🥳')
        fetch()
      }
    },
  })

  return <div ref={drop}>{children}</div>
}

export default function Home() {
  const [rows, setRows] = useState([])
  const [toast, setToast] = useState(null)

  const fetch = () => {
    apiRequest('/list').then(({ json }) => {
      setRows(json.data)
    })
  }
  useEffect(() => fetch(), [])

  return (
    <DndProvider backend={HTML5Backend}>
      <DroppableZone toast={v => setToast(v)} fetch={fetch}>
        {toast ? <div className={styles.toast}>{toast}</div> : null}
        <div className={styles.siteContainer}>
          <div className={styles.container}>
            <Head>
              <title>Outdoor.sy</title>
              <meta name="description" content="outdoorsy" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
              style={{
                display: 'flex',
                padding: '15px',
                justifyContent: 'space-around',
                fontSize: '2rem',
                maxWidth: 800,
                margin: '0 auto',
              }}
            >
              <button
                style={{ fontSize: '2rem' }}
                onClick={async () => {
                  await apiRequest('/nuke')
                  setRows([])
                  setToast('Deleted all data! 💀')
                }}
              >
                Delete all
              </button>
              Drag and drop to upload files!
            </div>
            <div style={{}}>
              <Grid
                data={rows}
                columns={[
                  'First Name',
                  'Last Name',
                  'Email',
                  'Vehicle Type',
                  'Vehicle Name',
                  'Vehicle Length',
                ]}
                search={true}
                sort={true}
              />
            </div>
          </div>
        </div>
      </DroppableZone>
    </DndProvider>
  )
}
