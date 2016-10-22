Open $url
Click on create

# Select a store
Within card-panel-store
  Select `[data-test=stores] label`
    Remember text as $StoreName
    Click
  Select button continue
    !Class should not contain "disabled"
    Click
  Select element `.preview-value`
    Property text should be $StoreName

# Fill in event details
Within card-panel-details
  Select input `[name=name]`
    Type $Faker.name
  Select textarea `[name=description]`
    Type $Faker.description
  Select input `[name=capacity]`
    Click at {200,2}
  Click on `[data-loadable="image-selector-trigger"]`

# Uploading an image
Within `.modal.bottom-sheet.open`
  Click on link new-image
  Select input `[name=uploaded_file]`
    Type $Faker.imagePath
  Click on input `[type=submit]`

Sleep for 5 seconds

# Submit details and check for preview
Within card-panel-details
  Click on button `[type=submit]`
  Select element preview
    Property text should be $Faker.name

Within card-panel-datetime
  Click on input `[name=date]`
  !Select first day in next month in the calendar
  Click on input `[name=time]`
  !Select morning time
  Click on button `[type=submit]`
