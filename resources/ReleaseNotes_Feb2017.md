RELEASE NOTES
========================================
**Glazing and Winter Comfort Tool 2.0**
 (February, 2017)

 We are pleased to announce  the release of version 2.0 of the Glazing and Winter Comfort Tool after several months of hearing your feedback, studying the latest research, and developing new features to address all of it!  Version 2.0 includes a number of updates and improvements, including:

###1) New Model for Downdraft Discomfort###
Using the findings and analysis from a recent study conducted by *Liu et al. (2016)*, we have replaced the downdraft discomfort model of the tool with a new one that more precisely targets cold discomfort at foot level.  The previous model, which was derived several decades ago from tests where cold air was blown on the back of subject’s necks, has been shown to overestimate occupant dissatisfaction from draft in a number of cases. As a result, this old draft discomfort model was removed from the *ASHRAE-55 Thermal comfort Standard* in 2010 and our use of this model in the tool was largely as a conservative proxy until a better one was developed.

*Liu et al's* new model computes occupant dissatisfaction from ankle draft (PPD<sub>AD</sub>) and was derived from studies where cold air was blown on occupants' feet at speeds and temperatures that are comparable to that of typical window downdrafts.  *Liu et al* have submitted the model for review by the ASHRAE committee to be incorporated into the *ASHRAE-55 Thermal Comfort Standard* and, if all goes smoothly, we can expect the new model to be officially incorporated into the standard within the next few years. For the time being, it is very clear to the developers of the *Glazing and Winter Comfort Tool* that this model is an improvement over the older one and, even though there may still be tweaks and roecommendations from the ASHRAE committee, we felt it was better to incorporate the model now.

More information on the experimental derivation of the model can be found in Liu et al's paper here:  
[Liu, S., Schiavon, S., Kabanshi, A. and Nazaroff, W. (2016), *Predicted Percentage Dissatisfied with Ankle Draft*. Indoor Air. Accepted Author Manuscript. doi:10.1111/ina.12364](https://escholarship.org/uc/item/9076254n)

###2) Choose Between Split (Two Charts) and Combined (One Chart) for Results Display###
In accordance with the new draft discomfort model, there will now be two separate PPD thresholds: one that defines what is acceptable for full-body radiant discomfort (PPD) and another that states what is appropriate for local ankle draft discomfort (PPD<sub>AD</sub>).  Specifically, the current proposal for *ASHRAE 55* states that no more than 20% of occupants should experience ankle draft discomfort.  This is different than the acceptable threshold for full-body discomfort, which is that no more than 10% of occupants should experience such radiant discomfort in regularly-occupied spaces.  To accommodate these different comfort thresholds, the *Glazing and Winter Comfort Tool* now supports two charts to display results – one for downdraft discomfort and one for full-body radiant discomfort.  Acceptable comfort thresholds can be set separately on each chart and separate PPD values can be seen for both.  We have left in an option to toggle to a "Combined" view that attempts to display both radiant and draft results on one chart, in case anyone liked the usability of the previous version of the tool.

###3) Support for All Browsers (Including Chrome)###
Some of you may have noticed that the previous version of the tool had several broken display features in Google Chrome.  This has now been fixed and you can currently take advantage of all capabilites of the *Glazing and Winter Comfort Tool* in any major browser that you desire.

###4) Outdoor Design Temperature Search Capability###
After applying the tool on several projects in our own office, we quickly realized that the key parameter that was stopping those without a science/engineering background from just opening the tool and immediately using it on a project was the requirement of an outdoor design temperature.  Oftentimes, people in our office could not start seriously exploring options until the building science team had sent such a temperature, creating a hiccup in the process. For those who started to explore without such a temperature, we found that many were simply leaving the default temperature and not changing this for the project's climate.  Accordingly, the new tool has moved this outdoor temperature input up to the top to make it clear that it should be set before exploring facade strategies.  We have also added the ability to search for the ASHRAE 99% design temperature for any location on the planet (as long as ther is an epw file associated with it).  This should make the tool's application more accessible to those who do not readily have an ASHRAE manual or EPW file on hand.

###5)	CSV Download Button###

After multiple requests for access to more data behind the scenes, we have added a button that allows you to download a excel file (CSV) of the results from the tool.  The CSV includes several parameters that are not present in the primary interface, like the glazing view factor, MRT, and downdraft air speed.  

###6) Copy URL Now Works as a File Saving / Sharing System###

Any of you who tried using the *Copy URL* feature of the previous tool probably ran into a bug at some point. We are happy to report that all of those known bugs are fixed and that this feature is working in the capacity that it was originally intended to.  You can now copy the URL, send it to a coworker or outside expert, they can open and edit the design, copy the URL again, and send it back to you. And it will all work!  We hope that this added stability will promote more sharing and sending of designs between design teams, engineers, consultants, and even clients!

###7) Advanced Inputs Are Change-able for All Cases###

A number of power users reuested the ability to change R-value, clothing, metabolic rate, and air speed values for each of the 3 different cases.  The new version allows the freedom to change this for all who are curious about the impact of these parameters.

###8) Save PDF Output is More Readable / Editable###

Many of you may have noticed a lot of information loss when you went to print the results of the tool to a PDF.  This has now been addressed and nearly information (and colors) will print.

###9)	Send Feedback Through Our Github###

In order to promote more dialogue between us (the developers) and you, we have switched from accepting feedback through our previously limited survey to [our new github](https://github.com/PayettePeople/Thermal-Comfort-Tool). Github is an online platform that enables developers and users to share and coordinate software development. By posting an issue on our github, you can request features and report bugs on a forum where other users/developers can easily see and respond.

In accordance with the last point, we are putting together an email list for anyone interested in staying up-to-date on the latest news around the tool.  This will include everything from new publications that inform the tool (or explain how the tool works) to implementations of the tool on other platforms (like our Rhino/Grasshopper plugin).  We are hoping that this list could also be a 2-way street so that you can easily provide us  with feedback, start discussions, and ask questions to us.  If you are interested in being on this list, please [email the developers](mailto:cmackey@payette.com?Subject=RE:%20Glazing%20Winter%20Comfort%20Tool) saying that you would like to be included.

Thank you and please let us know any comments or suggestions,

The Glazing and Winter Comfort Tool Development Team
