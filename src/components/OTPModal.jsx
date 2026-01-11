import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Clipboard, Send, Clock } from 'lucide-react'

export default function OTPModal({
  open,
  phone,
  onClose,
  onRequest,
  onVerify,
}) {
  const [otp, setOtp] = useState('')
  const [resendIn, setResendIn] = useState(60)
  const maskedPhone = useMemo(() => {
    if (!phone) return ''
    const compact = String(phone).replace(/\s+/g, '')
    if (compact.length <= 8) return phone
    const visibleStart = compact.slice(0, 4)
    const visibleEnd = compact.slice(-2)
    const maskedMid = '••••••'
    return `${visibleStart} ${maskedMid} ${visibleEnd}`
  }, [phone])

  useEffect(() => {
    if (!open) return
    setOtp('')
    setResendIn(60)
  }, [open])

  useEffect(() => {
    if (!open || resendIn <= 0) return
    const id = setInterval(() => setResendIn(prev => (prev > 0 ? prev - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [open, resendIn])

  useEffect(() => {
    if (open && otp.length === 4) {
      onVerify?.(otp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, open])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const digits = (text || '').replace(/\D/g, '').slice(0, 4)
      if (digits.length === 4) setOtp(digits)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={(o)=> !o && onClose?.()}>
      <DialogContent aria-describedby={undefined} className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Vérification OTP</DialogTitle>
          <DialogDescription>Un code a été envoyé à {maskedPhone || phone}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(v)=> setOtp((v || '').replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric"
            autoComplete="one-time-code"
            containerClassName="gap-5 justify-center py-1"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-12 w-12 text-lg rounded-xl bg-white text-[#29475B] border-2 border-[#E8F4F8] data-[active=true]:border-[#2B8286] shadow-sm" />
              <InputOTPSlot index={1} className="h-12 w-12 text-lg rounded-xl bg-white text-[#29475B] border-2 border-[#E8F4F8] data-[active=true]:border-[#2B8286] shadow-sm" />
              <InputOTPSlot index={2} className="h-12 w-12 text-lg rounded-xl bg-white text-[#29475B] border-2 border-[#E8F4F8] data-[active=true]:border-[#2B8286] shadow-sm" />
              <InputOTPSlot index={3} className="h-12 w-12 text-lg rounded-xl bg-white text-[#29475B] border-2 border-[#E8F4F8] data-[active=true]:border-[#2B8286] shadow-sm" />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handlePaste}>
              <Clipboard className="h-3.5 w-3.5 mr-1" /> Coller
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={()=> onRequest?.(phone)}
              disabled={resendIn > 0}
              className="text-[#2B8286] hover:bg-[#2B8286]/10"
            >
              {resendIn > 0 ? (<><Clock className="h-4 w-4 mr-1" /> {resendIn}s</>) : (<><Send className="h-4 w-4 mr-2" /> Renvoyer</>)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


