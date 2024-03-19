# Configuration

- admin panel 
- backend
- customer app
- technician app

# How to run  project?



- For backend
 to Rund command : node index

to Add new Product   postman    http://localhost:4000/api/v1/product/new

to Add New models Samsung or Any Product by name :  postman  http://localhost:4000/api/v1/product/model

{
  "name":"Oppo",     // this shooul be in choose Brand option 
  "modelList":"F7 "   // this need to be filled by Input
}

to  Get all product list : postman  http://localhost:4000/api/v1/product/all



to get All models of specific brand postman : http://localhost:4000/api/v1/product/modelList

{
"name":"Oppo"
}
