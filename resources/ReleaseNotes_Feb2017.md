RELEASE NOTES
========================================
###1) New Model for Downdraft Discomfort###

Using the findings and analysis from a recent study conducted by Liu et al. (2016), we have replaced the downdraft discomfort model of the tool with a new one that more precisely targets cold discomfort at foot level.  The previous model, which was derived several decades ago from tests where cold air was blown on the back of subject’s necks, has been shown to overestimate occupant dissatisfaction from draft in a number of cases. As a result, this old draft discomfort model was removed from the ASHRAE-55 Thermal comfort Standard in 2010 and our use of this model in the tool was largely as a conservative proxy until a better model was developed.

Liu et al's new model computes occupant dissatisfaction from ankle draft (PPD<sub>AD</sub>) and was derived from studies where cold air was blown on occupants' feet at speeds and temperatures that are comparable to that of typical window downdrafts.  Liu et al have submitted the model for review by the ASHRAE committee to be incorporated into the ASHRAE-55 Thermal Comfort Standard and, if all goes smoothly, we can expect the new model to be officially incorporated into the standard within the next few years.
For the time being, it is very clear to the developers of the *Glazing and Winter Comfort Tool* that this model is an improvement over the older one and, even though there may still be tweaks and roecommendations from the ASHRAE committee, we felt it was better to incorporate the model now.

More information on the experimental derivation of the model can be found in Liu et al's paper here:  
[Liu, S., Schiavon, S., Kabanshi, A. and Nazaroff, W. (2016), Predicted Percentage Dissatisfied with Ankle Draft. Indoor Air. Accepted Author Manuscript. doi:10.1111/ina.12364](https://escholarship.org/uc/item/9076254n)

###2)	Choose Between Slipt (Two Charts) and Combined (One Chart) for Results Display###

In accordance with the new proposed model for ASHRAE-55, there will now be two separate PPD thresholds that define what is acceptable for full-body radiant discomfort and local ankle draft discomfort.  Specifically, the current proposal states that no more than 20% of occupants should experience ankle draft discomfort, which is distinct from the 10% threshold for full-body discomfort that is recommended for most regularly-occupied spaces.  To accommodate this difference, the Glazing and Winter Comfort Tool now has two charts to display results – one for downdraft discomfort and one for full-body radiant discomfort.  Acceptable comfort thresholds are set separately on each chart.

Support for All Browsers (Including Chrome)

Outdoor Design Temperature Search

**3)	CSV Download Button** – After multiple requests for access to more data behind the scenes, we have added a button that allows you to download a excel file (CSV) of the results from the tool.  The CSV includes several parameters that are not present in the primary interface, like the glazing view factor, MRT, and downdraft air speed.

Copy URL Now Works as a True File Saving / Sharing System -

Advanced Inputs are Change-able for All cases -

Save PDF Output is More Readable / Editable -

**4)	Feedback Now Given Through Github** – In order to promote more dialogue between us (the developers) and you, we have switched from accepting feedback through our previously limited survey to our new github. Github is an online platform that enables developers and users to share and coordinate software development. By posting an issue on our github, you can request features and report bugs on a forum where other users/developers can easily see and respond.
