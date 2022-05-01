
# Xenote Changelog

## ***04-30 Auto-renew beta final**

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