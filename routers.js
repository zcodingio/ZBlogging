
module.exports = function(app){

    const { await } = require('await');
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/zcodeDB', { useNewUrlParser: true }).then(function(err, db) {
        console.log("Connected to Mongo");
    });
    //Upload Destination for Posts & Profile Photos
    const multer  = require('multer');
    const PostStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "public/img/posts/");
        },
        filename: (req, file, cb) => {
          const ext = file.mimetype.split("/")[1];
          cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
        },
      });
    
    const UserStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "public/img/users/");
        },
        filename: (req, file, cb) => {
          const ext = file.mimetype.split("/")[1];
          cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
        },
    });


    const uploadPost = multer({
        storage: PostStorage,
      });
    const uploadUser = multer({
    storage: PostStorage,
    });

    const userSchema = new mongoose.Schema({
    userid: Number,
    fname: String,
    lname: String,
    full_name: String,
    email: String,
    phone: String,
    age: Number,
    password: String,
    session_id: String,
    session: String,
    gender: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String
    });
    const User = mongoose.model('User', userSchema);

    //Blog Posts Schema
    const blogPostSchema = new mongoose.Schema({
        post_id: Number,
        title: String,
        excerpt: String,
        description: String,
        slug: String,
        status: String,
        visibility: String,
        image_name: String,
        category_id: Number,
        category_name: String,
        content_type: String,   
        content_id: Number,
        meta_keywords: String,
        meta_descrtion: String,
    });
    const Post = mongoose.model('Post', blogPostSchema);


    
    // Post Types Schema
    const ContentTypeSchema = new mongoose.Schema({
        type_id: Number,
        Content_name: String,
        slug: String,
    });
    const Content_Type = mongoose.model('Content_Type', ContentTypeSchema);

    //Blog Categories Schema
    const CategorySchema = new mongoose.Schema({
        cat_id: Number,
        category: String,
        slug: String,
        parent_cat: String,
    });
    const Category = mongoose.model('Category', CategorySchema);

//Frontend Pages Routes

    //Root Route    
    app.get('/', (req, res) => {
        res.render('index', {title: 'ZCoding Homepage'});
    });    

    //Contact Page route
    app.get('/contact', (req, res) => {
        res.render('contact', {title: 'Contact Us'});
    });

    //Create A New Post Route
    app.get('/create-post', async(req, res) => {
        var getCategory = await Category.find();
        var type = await Content_Type.find();
        res.render('lib/new-post', {
            title: 'Add A New Post', 
            category: getCategory, 
            type: type,
            status: '',
        });
    });

    app.get('/category', async(req, res) => {

        //allCategories = mongoose.model('categories');
        allCats = await Category.find();
        res.render('category', {title: 'All Categories'});
    });

    app.get('/category/:param', async(req, res) => {
        
        getCat = await Category.findOne({category: req.params.param});
        //allCats = await Post.find({category: getCat.cat_id});
        res.render('category', {title: 'Zoho CRM'});
    });


    //Backend Pages routes down the line
    //categories Route
    app.get('/categories', async(req, res) => {

        //allCategories = mongoose.model('categories');
        allCats = await Category.find({});
        console.log(allCats);
        res.render('lib/categories', {cats:allCats, title: 'All Categories'});
        
    });

    //Content Type Route
    app.get('/content-types', async(req, res) => {
        var contents = await Content_Type.find();
        res.render('lib/content-types', {title: 'Content Types', types: contents});
    });

    //Account & Other User Routes
    app.get('/account', (req, res) => {
        res.render('lib/account', {title: 'My Account'});
    });
    app.get('/profile', (req, res) => {
        res.render('lib/profile', {title: 'My Profile'});
    });
    app.get('/edit-profile', (req, res) => {
        res.render('lib/edit-profile', {title: 'Edit Profile'});
    });


    //All Posts Routes will go down the line

    //Add New Categories to Data Model
    app.post('/add-category', async(req, res) => {
        var category = req.body.category;
        var slug = req.body.slug;
        var cID = new Date().valueOf();
        const addCat = new Category({
            cat_id: cID,
            category: category,
            slug: slug,
            parent_cat: '',
        });
        //console.log(addCat);
        var result = await Category.create(addCat);
        if (result._id != null){
            //console.log(result);
            res.send({status: 'success', code: 200});
        }else{
            res.send({status: 'Something went wrong'});
        }
    }) 

    //Add New Post Types to database
    app.post('/insert-type', async(req, res) => {
        var type = req.body.name;
        var slug = req.body.slug;
        console.log(type, slug);
        var cID = new Date().valueOf();
        const addType = new Content_Type({
            type_id: cID,
            Content_name: type,
            slug: slug,
        });
        
        var result = await Content_Type.create(addType);
        console.log(result);
        if (result._id != null){
            res.send({status: 'success', code: 200});
        }else{
            res.send({status: 'Something went wrong'});
        }
    })

    app.post('/insert-post', uploadPost.single('featured_image'), async function(req, res){
        //console.log(req.file.filename, req.body);
        var gettype = await Content_Type.find({type_id: req.body.content_type});
        var getCate = await Category.find({cat_id: req.body.category});
        var postObj =  new Post({
            post_id: Date.now(),
            title: req.body.title,
            excerpt: req.body.description.replace( /(<([^>]+)>)/ig, ''),
            description: req.body.description,
            slug: req.body.slug + '-' + Date.now(),
            status: req.body.status,
            visibility: req.body.visibility,
            image_name: req.file.filename,
            category_id: req.body.category,
            category_name: getCate[0].category,
            content_type: gettype[0].Content_name,   
            content_id: req.body.content_type,
            meta_keywords: req.body.meta_keywords,
            meta_descrtion: req.body.meta_descrtion,
        })
        
        var result = await Post.create(postObj);
        
        var getCategory = await Category.find();
        var type = await Content_Type.find();
        
        if(result._id != null) {
            res.render('lib/new-post', {
                status: 200, 
                title: 'Add A New Post', 
                category: getCategory, 
                type: type
            });
        }else{
            alert("Post Couldn't be created due to an error. Please try again");
        }
    })
}