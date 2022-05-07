
# Xenote Changelog

## *** [Mini Update 3.5]

Added an icon button to turn off notifications for individual subtasks

Found a bug in subtasks: it won't let you edit text fields for subtasks below the second one (can still create them and can still change the date)

TODO:
Function to delete tags
Prevent duplicate tags
Sort by tag

## ***05-06 Update 3

Caveat: the database will reset because the schema has changed

Can now set a note category and add (hash)tags

Can now sort by category

Added #Hashtag search (start search with '#')

Added category, tags to search filter

Category and tags now display on the note

## **05-06 Update 2**

Added search function to notes

Cancel icon resets the query

Clicking the magnifying glass or anywhere else on the screen will dismiss the keyboard

If the search term is a number, will try to filter by priority (equal) and note size (>= search term)

If this search has no results, app will try to do a normal search as below

Case insensitive search for all textual note categories (title, subject, body, etc)

Added skeleton code to schema for handling Note categories and tags in future

Added search function to notes

Cancel icon resets the query

Clicking the magnifying glass or anywhere else on the screen will dismiss the keyboard

If the search term is a number, will try to filter by priority (equal) and note size (>= search term)

If this search has no results, app will try to do a normal search as below

Case insensitive search for all textual note categories (title, subject, body, etc)

Added skeleton code to schema for handling Note categories and tags in future

## **05-06 New Branch (start of May feature updates)**

5/6 Update

Small tweaks to button functionality (long press does not work as intended on android devices)

Auto-refresh button => press to turn on / automatically sync notifications with auto-renew

Disable notification button => each reminder now has a dedicated button to disable notifications

Fixed autorenew's interaction with the checkbox. Marking the checkbox no longer cancels auto-renew. Performing an auto-renew still resets the checkbox as intended

Early push incase something breaks later

## **05-01 Update 3 (Final)**

Showcase ready

Note item pins added

Notes page sorting options

Pinned always takes precedence

(Almost) feels like file explorer haha

Let me know if there are any issues.

Need to do a yarn install or yarn add react-native-select-dropdown

## ***05-01 Auto-refresh update 2**

Streamlined auto-refresh functions:

Press
Refresh notifications
Disabled alert if auto-renew is not on 

Long press
delete all non-recurring notifications for this reminder (autorenew on)
delete all notifications for this reminder (autorenew off)

Added a custom logo to notifications

Performance should be better now

May push one more update if I get around to note pinning - done

## ***05-01 Auto-refresh improvements**

Statuses for reminders that expired while the app was closed should now be properly synced upon restarting the app

Feature improvement to notification auto-refresh by making it automated and accurately enable/disable.

Auto-refresh Button
Press = clear notifications for reminder
Long press = turn on auto-refresh

Improved performance on android AVDs, more testing needed here

Fixed a typo where a reminder became expired after ~5.5 min instead of ~55.5 min of lateness

**_TODO:_**
**iron out bugs and stuff**
**Test for wonkiness and stability**
**Integrate with new UI features**

## **04-30 Auto-renew beta final**

Crashes and memory leaks due to deleted objects should be fixed now.

The app now polls renewal statuses every **~~60~~ ==> _30_** seconds for closer to live updates.

Properly set the grace period for expired stuff. Beyond these time windows, objects are past-expired.
Auto-renew: **55.55 minutes**
Notify: **59 minutes**

You can only turn on auto-renew if the reminder isn't past-expired.

You can only turn on notifications if the reminder / subtask isn't past-expired.

Fixed a notification display bug where _reminder.title_ was literally showing that

Made it so most notifications cancel as soon as you click on them to reduce annoyance.

Removed most popup alerts except those concerning renewal or disabled functionality

Renew button updates the notification timestamps if the reminder has been auto-renewed (only has an effect if auto-renew is on)

Probably final update for the weekend barring hotfixes

**_TODO:_**
**iron out bugs and stuff**
**Test for wonkiness and stability**
**Integrate with new UI features**


## 04-30 Auto-renew beta

- Auto-renew functionality added to reminders
- Auto-renew window for expiration changed to _~55 minutes_ _past due
- New Memory leak issue (resolved)

### Previous changes

### Small UI tweaks

- Priority selection now clearly visible
- Can view limited body text, priority of note
- Notes can be toggle flagged with right swipe
- Added bouncy-checkbox as a UI competitor to rounded-checkbox - see subtasks

### Swiping

- Added functionality for up swipe and down swipe if needed
- Right swipe working with subtasks

### Notifications

- Placed reminder and subtask notifications in separate channels

### Bug Fixes

- Fixed a bug where opening the subtask modal also triggers a 'right swipe'
- Now it triggers a down swipe (unbound function)

### TODO

- Checkbox marking should cancel the associated notification(s)
- Intro Page
- UI fixes
- Settings

#### Other

## Gradle troubleshooting

Inside android/gradle/wrapper/gradle-wrapper.properties

## Local version

distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=file\:///S:\Installers/gradle-7.4-all.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists

## Replace with

distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
[(distributionUrl=https\://services.gradle.org/distributions/gradle-7.4-all.zip)]
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists