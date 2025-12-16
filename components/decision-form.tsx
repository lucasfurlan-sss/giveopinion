"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type YesNo = "yes" | "no" | null

const STEPS = [
  "Open",
  "In Progress",
  "Outreach",
  "Needs Second Opinion",
  "Awaiting Reply",
  "Ready to Action",
  "Complete",
] as const

type SuspensionAction = "team" | "team_user" | "project" | ""

export default function DecisionForm() {
  const [platform, setPlatform] = useState<YesNo>(null)
  const [visualDirectory, setVisualDirectory] = useState<YesNo>(null)
  const [highRisk, setHighRisk] = useState<YesNo>(null)
  const [mediumRisk, setMediumRisk] = useState<YesNo>(null)
  const [secondOpinion, setSecondOpinion] = useState<YesNo>(null)
  const [status, setStatus] = useState<string>("Open")
  const [goodSignals, setGoodSignals] = useState<YesNo>(null)

  const [suspensionAction, setSuspensionAction] = useState<SuspensionAction>("")

  const handleDone = () => {
    let nextStatus: string = "Open"

    if (secondOpinion === "yes") {
      nextStatus = "Needs Second Opinion"
    } else if (platform === "yes" && (highRisk === "yes" || mediumRisk === "yes")) {
      nextStatus = "Outreach"
    } else if (highRisk === "yes" || mediumRisk === "yes" || visualDirectory === "yes" || goodSignals === "yes") {
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
    <div className="w-full max-w-[480px] border-l border-border bg-card flex flex-col">
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
                  <span
                    className={`text-[10px] text-center ${
                      isCompletedOrActive ? "font-semibold" : ""
                    }`}
                  >
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
              {/* NEW QUESTION - Visual Directory */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">Is this a Visual Directory?</p>


                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-sm p-1 hover:bg-muted"
                          aria-label="Visual Directory info"
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        If you encounter a phishing pattern that isn’t in our Visual Directory, add it to Notion with screenshots.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(visualDirectory, "yes")}`}
                    onClick={() => setVisualDirectory("yes")}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(visualDirectory, "no")}`}
                    onClick={() => setVisualDirectory("no")}
                  >
                    NO
                  </Button>
                </div>
              </div>

              {/* Question 1 - Platform/Enterprise */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Is this a Platform/Enterprise?</p>
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

              {/* Question 2 - High Risk Signal (textarea removed) */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                 After reviewing the AI opinion, did you confirm at least 1 High-Risk signal?
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
              </div>

              {/* Question 3 - Medium Risk Signal (textarea removed) */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  After reviewing the AI opinion, did you confirm at least 3 Medium-Risk signals?
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
              </div>
              
              {/* Question 4 - Good Signals */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  After reviewing the AI opinion, Did you confirm any Non-Risk (Good) signals?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(goodSignals, "yes")}`}
                    onClick={() => setGoodSignals("yes")}
                  >
                    YES
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${yesClass(goodSignals, "no")}`}
                    onClick={() => setGoodSignals("no")}
                  >
                    NO
                  </Button>
                </div>
              </div>
              {/* Question 4 - Second Opinion */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Is a Second Opinion Needed?</p>
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
                  placeholder="Please explain why a second opinion is needed"
                  className="text-xs min-h-[30px]"
                />
              </div>

              {/* Suspension Reasons */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Suspension Reasons:</p>
                <Select>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Suspension Reasons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="malware">Malware</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Suspension Actions */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Suspension Actions:</p>
                <Select
                  value={suspensionAction}
                  onValueChange={(v) => setSuspensionAction(v as SuspensionAction)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="team_user">Team and User</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2 pt-4">
                <p className="text-sm font-semibold text-foreground">Notes:</p>
                <Textarea
                  placeholder="Add any additional notes here..."
                  className="text-xs min-h-[80px]"
                />
              </div>

              {/* Upload Evidence */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Upload Evidence:</p>
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

              <div className="space-y-2 pt-2">
                {/* Do not reinstate + info */}
                <div className="flex items-center gap-2">
                  <Checkbox id="no-reinstate" />
                  <label htmlFor="no-reinstate" className="text-xs cursor-pointer">
                    Do not reinstate
                  </label>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-sm p-1 hover:bg-muted"
                          aria-label="Do not reinstate info"
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                       Select only if this case relates to VD, repeated abuse, or a common scheme.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Not hosted on Vercel */}
                <div className="flex items-center gap-2">
                  <Checkbox id="not-hosted-vercel" />
                  <label htmlFor="not-hosted-vercel" className="text-xs cursor-pointer">
                    Not hosted on Vercel
                  </label>
                </div>
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