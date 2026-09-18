# Plan: finish the website/dashboard fixes

## Goal
Complete the unfinished dashboard and homepage updates so the live site can be edited from the dashboard and the broken dashboard login/backend setup is repaired.

## What I will change

1. **Repair the dashboard login path**
   - Add the missing backend schema needed by the dashboard.
   - Ensure the admin password/session storage tables exist with safe access rules.
   - Fix the server helper mismatch that currently breaks admin/database calls.
   - Set the dashboard password securely through project secrets if needed.

2. **Finish the dashboard menus**
   - Add dashboard entries for:
     - Home content editing
     - Wheel/background/widget editing
     - Weekly events
   - Wire the already-built editors into the dashboard so they are actually reachable.

3. **Remove the unwanted wheel backdrop**
   - Remove the pale blue animated painting/city-style background from the insurance wheel area.
   - Keep the existing uploaded/background image layer intact so the image that was not showing remains safe.
   - Keep the new widget area separate, so future ZIP/widget uploads do not erase the saved background image.

4. **Make homepage sections editable**
   - Connect the app-download section to dashboard settings.
   - Place the app image on the left and the text/download button on the right.
   - Connect article card images to dashboard/media uploads while preserving the current card corner shape.
   - Connect business partner cards to dashboard settings so logos/images, text, and buttons can be edited.

5. **Add weekly event banners**
   - Show weekly event popup/banner slots on the public site.
   - Support left and right columns, up to 6 banners per side.
   - Keep close buttons on banners.
   - Use dashboard settings for side, level/order, animation, image/ZIP/widget content.
   - Preserve drag-and-drop ordering in the dashboard.

6. **Harden uploads**
   - Allow the needed media and ZIP uploads for these dashboard tools.
   - Validate file type and size so broken uploads fail clearly.

7. **Verify**
   - Check the app loads without the placeholder page.
   - Test the dashboard login state as far as available secrets allow.
   - Verify the homepage displays editable content and weekly banners without breaking the preserved wheel image.

## Notes
- I will not delete existing uploaded images or media.
- If the current dashboard password is unknown, I will create/set a new secure password secret and tell you the practical result without exposing private backend details.
