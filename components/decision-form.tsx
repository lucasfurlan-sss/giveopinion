"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload } from "lucide-react"

type YesNo = "yes" | "no" | null

const STEPS = [
  "Open",
  "In Progress",
  "Outreach",
  "Needs Second Opinion",
  "Awaiting Reply",
  "Ready to Action",
  "Done",
] as const

export default function DecisionForm() {
  const [platform, setPlatform] = useState<YesNo>(null)
  const [highRisk, setHighRisk] = useState<YesNo>(null)
  const [mediumRisk, setMediumRisk] = useState<YesNo>(null)
  const [secondOpinion, setSecondOpinion] = useState<YesNo>(null)
  const [status, setStatus] = useState<string>("Open")

  const handleDone = () => {
    let nextStatus: string = "Open"

    if (secondOpinion === "yes") {
      nextStatus = "Needs Second Opinion"
    } else if (platform === "yes" && (highRisk === "yes" || mediumRisk === "yes")) {
      nextStatus = "Outreach"
    } else if (highRisk === "yes" || mediumRisk === "yes") {
      nextStatus = "Ready to Action"
    } else {
      nextStatus = "Open"
    }

    setStatus(nextStatus)
  }

  const activeIndex = Math.max(0, STEPS.indexOf(status as (typeof STEPS)[number]))
  const progressPercent = (activeIndex / (STEPS.length - 1)) * 100

  const yesClass = (value: YesNo, selected: "yes" | "no") =>
    value === selected ? "bg-primary text-primary-foreground border-primary" : ""

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col">
      {/* PROGRESS BAR */}
      <div className="border-b border-border px-3 pt-3 pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          <span className="text-xs font-medium">{status}</span>
        </div>

        <div className="relative">
          <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
            {STEPS.map((step, idx) => {
              const isCompletedOrActive = idx <= activeIndex
              return (
                <div key={step} className="flex flex-col items-center w-full">
                  <div
                    className={`h-2 w-2 rounded-full mb-0.5 ${
                      isCompletedOrActive ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span className={`text-[9px] text-center ${isCompletedOrActive ? "font-semibold" : ""}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="h-1 w-full bg-muted rounded-full overflow-hidden mt-1">
            <div
              className="h-1 bg-primary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Give First Opinion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question 1 - Platform/Enterprise */}
              <div className="space-y-2">
                <p className="text-xs text-foreground">Is this a Platform/Enterprise?</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(platform, "yes")}`}
                    onClick={() => setPlatform("yes")}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(platform, "no")}`}
                    onClick={() => setPlatform("no")}
                  >
                    NO
                  </Button>
                </div>
              </div>

              {/* Question 2 - High Risk Signal */}
              <div className="space-y-2">
                <p className="text-xs text-foreground">
                  Have you found at least 1 High Risk Signal? Or Confirm at least 1 High Risk Signal from AI Opinion?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(highRisk, "yes")}`}
                    onClick={() => setHighRisk("yes")}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(highRisk, "no")}`}
                    onClick={() => setHighRisk("no")}
                  >
                    NO
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste Signals found"
                  className="text-xs min-h-[60px]"
                />
              </div>

              {/* Question 3 - Medium Risk Signal */}
              <div className="space-y-2">
                <p className="text-xs text-foreground">
                  Have you found at least 3 Medium Risk Signal? Or Confirm at least 3 Medium Risk Signal from AI Opinion?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(mediumRisk, "yes")}`}
                    onClick={() => setMediumRisk("yes")}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(mediumRisk, "no")}`}
                    onClick={() => setMediumRisk("no")}
                  >
                    NO
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste Signals found"
                  className="text-xs min-h-[60px]"
                />
              </div>

              {/* Question 4 - Second Opinion */}
              <div className="space-y-2">
                <p className="text-xs text-foreground">Is a Second Opinion Needed?</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(secondOpinion, "yes")}`}
                    onClick={() => setSecondOpinion("yes")}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(secondOpinion, "no")}`}
                    onClick={() => setSecondOpinion("no")}
                  >
                    NO
                  </Button>
                </div>
                <Textarea
                  placeholder="Reason why a Second Opinion is Needed"
                  className="text-xs min-h-[60px]"
                />
              </div>

              {/* Suspension Reasons */}
              <div className="space-y-2">
                <p className="text-xs font-semibold">Suspension Reasons:</p>
                <Select>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Drop-down List with Suspension Reasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="malware">Malware</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2 pt-4">
                <p className="text-xs font-semibold">Notes:</p>
                <Textarea
                  placeholder="Add any additional notes here..."
                  className="text-xs min-h-[80px]"
                />
              </div>

              {/* Upload Evidence */}
              <div className="space-y-2">
                <p className="text-xs font-semibold">Upload Evidence:</p>
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center">
                    Drag and Drop or Browse files
                  </span>
                  <input id="file-upload" type="file" className="hidden" multiple />
                </label>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="no-reinstate" />
                <label htmlFor="no-reinstate" className="text-xs cursor-pointer">
                  Do not reinstate
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer Done button */}
      <div className="p-4 border-t border-border bg-card">
        <Button className="w-full" onClick={handleDone}>
          Done
        </Button>
      </div>
    </div>
  )
}



