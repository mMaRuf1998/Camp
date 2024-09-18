const Campground = require('../models/campground');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm =  (req, res) => {
   
    res.render("campgrounds/new");
     
}



module.exports.createCampground = async (req, res, next) => {
    
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f=>({url:f.path , filename:f.filename}))
    campground.author = req.user._id 
    console.log(campground)
    await campground.save();
    req.flash('success', 'Successfully added a new Campground !');
    res.redirect(`/campgrounds/${campground._id}`)


} 

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path:'reviews' ,
                                        populate:{
                                            path:'author'
                                        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', "Campground not found !")
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
}

 
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Campground not found !")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}


module.exports.updateCampground = async (req, res) => {
    
    const { id } = req.params;
    console.log(req.body)

    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f=>({url:f.path , filename:f.filename})) ;
    campgrounds.images.push(...imgs) ;
    await campgrounds.save() ;
    req.flash('success', 'Successfully updated a new Campground !');

    res.redirect(`/campgrounds/${campgrounds._id}`);
} 

module.exports.deleteCampground = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('error', 'Successfully deleted a new Campground !');

    res.redirect("/campgrounds");


}