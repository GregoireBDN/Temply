import * as React from 'react'
import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

type ConfirmVariant = 'primary' | 'danger' | 'warning' | 'success'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  /** Titre du dialog */
  title?: string
  /** Description / message d'avertissement */
  description?: string
  /** Texte du bouton de confirmation */
  confirmLabel?: string
  /** Texte du bouton d'annulation */
  cancelLabel?: string
  /** Couleur du bouton de confirmation */
  variant?: ConfirmVariant
  /** État de chargement du bouton de confirmation */
  loading?: boolean
  /** Élément déclencheur (optionnel — si absent, utiliser open/onOpenChange manuellement) */
  trigger?: React.ReactNode
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Êtes-vous sûr ?',
  description = 'Cette action ne peut pas être annulée.',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'primary',
  loading = false,
  trigger,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" outline disabled={loading}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button variant={variant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
