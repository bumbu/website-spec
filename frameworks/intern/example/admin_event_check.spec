Open `/admin/`

Within element `.events`
  # Check first event
  Select `.event`
    Property text should be `Open`
    Click on button `[data-action=open]`
    Property text should be `Close`
    Select `.title`
      Remember text as $firstEventName

  # Go to next page
  Select `.pagination`
    Click on link `.next`

  # Now first element title should be different
  Select `.event .title`
    Property text should not be $firstEventName
