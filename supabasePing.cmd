@echo off
REM Supabase Ping Simple CMD Script

REM Define projects (edit as needed)
setlocal enabledelayedexpansion
set "projects[0]=Switchhere|https://dpjecsmfaowddjgxdqyw.supabase.co|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamVjc21mYW93ZGRqZ3hkcXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjA3MzYsImV4cCI6MjA1OTY5NjczNn0.td70Zy7hpiKc9c2w1BhstBKqZtlpN2DM4RGaN_W4enE|users"
set "projects[1]=freeipltips|https://bkktjuujakjtemmduodw.supabase.co|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJra3RqdXVqYWtqdGVtbWR1b2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NjYyODcsImV4cCI6MjA1MTA0MjI4N30.QahXSzUXvPcVz_kvkVjdcGxANm6hcb7NdlU7uFJnx7I|guests"
set "projects[2]=linir|https://wjymxxavsxzwzfbvwxnf.supabase.co|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqeW14eGF2c3h6d3pmYnZ3eG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTIxMTQsImV4cCI6MjA1ODE4ODExNH0.LXFsHYHwLjeWTYt3EcrS3TGGIFoXEYjTHIDv3S557x8|users"
set "projects[3]=deshfix|https://qhgmtsrbcgboymrqoakf.supabase.co|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ210c3JiY2dib3ltcnFvYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjUyMDksImV4cCI6MjA3ODcwMTIwOX0.s3hEG3VaFkkQ0BEdmsysioUfnG2wN120SxxK7CqvOCo|problems"

echo Project,OK?

REM Loop through projects
for /l %%i in (0,1,3) do (
    for /f "tokens=1-4 delims=|" %%A in ("!projects[%%i]!") do (
        REM Note: 'curl' must be installed on Windows
        curl -s -o nul -w "%%{http_code}" ^
            "%%B/rest/v1/%%D?select=*&limit=1" ^
            -H "apikey: %%C" ^
            -H "Authorization: Bearer %%C" ^
            -H "Content-Type: application/json" > result.txt

        set /p STATUS=<result.txt

        if "!STATUS!" == "200" (
            set "ICON=OK"
        ) else (
            set "ICON=FAIL"
        )
        echo %%A,!ICON!
        del result.txt
    )
)
REM End of script but delay to view results
timeout /t 2 /nobreak > nul
endlocal