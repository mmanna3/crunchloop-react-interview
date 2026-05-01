import { useEffect, useRef, useState } from 'react'
import * as signalR from '@microsoft/signalr'

const BASE_URL = import.meta.env.VITE_API_URL

type BulkProgressEvent = {
  operationId: string
  listId: number
  completed: number
  total: number
  completedIds: number[]
}

type BulkState = {
  completed: number
  total: number
  isFinished: boolean
  completedIds: number[]
}

export function useBulkCompleteListener() {
  const [progress, setProgress] = useState<BulkState | null>(null)
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    return () => {
      connectionRef.current?.stop()
    }
  }, [])

  async function connect(): Promise<string> {
    await connectionRef.current?.stop()

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/todo`)
      .withAutomaticReconnect()
      .build()

    connection.on('OperationProgress', (event: BulkProgressEvent) => {
      setProgress({
        completed: event.completed,
        total: event.total,
        isFinished: event.completed === event.total,
        completedIds: event.completedIds,
      })
    })

    await connection.start()
    connectionRef.current = connection
    return connection.connectionId!
  }

  return { connect, progress }
}
