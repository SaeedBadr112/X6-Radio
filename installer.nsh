!include MUI2.nsh
!include nsDialogs.nsh

; -------------------------------
; Language Selection Custom Page
; -------------------------------
Var LanguageSelection   ; "en" or "ar"

Function LanguagePageCreate
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 12u "Please select the installation language:"
  Pop $0

  ${NSD_CreateRadioButton} 10u 25u 100% 10u "English"
  Pop $1
  ${NSD_CreateRadioButton} 10u 45u 100% 10u "العربية (Arabic)"
  Pop $2

  ; Pre-select English by default
  ${If} $LanguageSelection == "en"
    ${NSD_Check} $1
  ${ElseIf} $LanguageSelection == "ar"
    ${NSD_Check} $2
  ${Else}
    ${NSD_Check} $1
    StrCpy $LanguageSelection "en"
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function LanguagePageLeave
  ${NSD_GetState} $1 $0
  ${If} $0 == ${BST_CHECKED}
    StrCpy $LanguageSelection "en"
  ${Else}
    StrCpy $LanguageSelection "ar"
  ${EndIf}
FunctionEnd

; -------------------------------
; Insert custom page before MUI_PAGE_WELCOME
; -------------------------------
Page custom LanguagePageCreate LanguagePageLeave

; -------------------------------
; Write config.json after successful installation
; -------------------------------
Function .onInstSuccess
  CreateDirectory "$APPDATA\X6 Radio"
  FileOpen $0 "$APPDATA\X6 Radio\config.json" w
  ${If} $LanguageSelection == "en"
    FileWrite $0 '{ "language": "en" }$\r\n'
  ${Else}
    FileWrite $0 '{ "language": "ar" }$\r\n'
  ${EndIf}
  FileClose $0
FunctionEnd