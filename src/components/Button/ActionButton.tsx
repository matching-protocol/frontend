import Button from './Button'
// import OutlineButton from './OutlineButton'
import Spinner from 'components/Spinner'
import { Typography } from '@mui/material'

export default function ActionButton({
  error,
  pending,
  success,
  onAction,
  actionText,
  pendingText,
  height,
  width,
  disableAction,
  successText,
  borderRadius,
  errorSubText,
  onErrorAction
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  onAction: (() => void) | undefined
  actionText: string
  pendingText?: string
  successText?: string
  height?: string
  width?: string
  disableAction?: boolean
  borderRadius?: string
  errorSubText?: string
  onErrorAction?: (() => void) | undefined
}) {
  return (
    <>
      {pending ? (
        <Button disabled height={height} width={width} borderRadius={borderRadius}>
          <Spinner marginRight={16} />
          {pendingText || 'Waiting Confirmation'}
        </Button>
      ) : error ? (
        <>
          <Button height={height} width={width} borderRadius={borderRadius} onClick={onErrorAction}>
            {error}
          </Button>
          {errorSubText && (
            <Typography fontSize={11} color="#FF0000" mt={12}>
              {errorSubText}
            </Typography>
          )}
        </>
      ) : success ? (
        <Button disabled height={height} width={width} borderRadius={borderRadius}>
          <Typography variant="inherit">{successText ?? actionText}</Typography>
        </Button>
      ) : (
        <Button height={height} width={width} onClick={onAction} disabled={disableAction} borderRadius={borderRadius}>
          {actionText}
        </Button>
      )}
    </>
  )
}
