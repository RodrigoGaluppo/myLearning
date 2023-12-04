using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using DAL.Controllers.Request;
using Microsoft.EntityFrameworkCore;

namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController : ControllerBase
{
   
    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public CustomerController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpPut("confirm/{id}")]
    public async Task<IActionResult> Confirm([FromRoute] string id, [FromBody] ConfirmCustomerRequest confirmCustomerRequest )
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Customers.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                
                .SetProperty(u => u.IsConfirmed, u => confirmCustomerRequest.isConfirmed)
                
            );

            var newCustomer = await dbContext.Customers.Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
            return Ok(newCustomer);

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

[HttpPut("changePassword/{id}")]
    public async Task<IActionResult> Change([FromRoute] string id, [FromBody] ChangePasswordRequest changePasswordRequest )
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Customers.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                .SetProperty(u => u.Password, u => BCrypt.Net.BCrypt.HashPassword(changePasswordRequest.Password))
            );

            var newCustomer = await dbContext.Customers.Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
            return Ok(newCustomer);

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("active/{id}")]
    public async Task<IActionResult> CHangeActive([FromRoute] string id, [FromBody] CustomerChangeActiveRequest customerChangeActiveRequest )
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Customers.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                
                .SetProperty(u => u.Active, u => customerChangeActiveRequest.Active)
                
            );

            var newCustomer = await dbContext.Customers.Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
            return Ok(newCustomer);

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id, [FromBody] CustomerPutRequest customerPutRequest)
    {
        
        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var fieldsInUse = await dbContext.Customers
                .FirstOrDefaultAsync( u=> 
                (u.Username == customerPutRequest.Username ) && u.Id.ToString() != id 
            ); // if he is trying to take an email that is already in use by someone thats not himself
           
            if(fieldsInUse != null){
                return BadRequest(ApplicationError.userExists);
            }

            await dbContext.Customers.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                .SetProperty(u => u.FirstName,  u => customerPutRequest.FirstName)
                .SetProperty(u => u.LastName, u => customerPutRequest.LastName)
                .SetProperty(u => u.BirthDate, u => DateOnly.FromDateTime(DateTime.Parse(customerPutRequest.BirthDate)))
             
                .SetProperty(u => u.Username, u => customerPutRequest.Username)
                .SetProperty(u => u.Gender, u => customerPutRequest.Gender)
                .SetProperty(u => u.UpdatedAt, u => DateTime.Now)
            );
             

            var newCustomer = await dbContext.Customers.Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
            return Ok(newCustomer);

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPut("image/{id}")]
    public async Task<IActionResult> PutImage([FromRoute] string id, [FromBody] CustomerChangeImageRequest customerPutRequest)
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
        


            await dbContext.Customers.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                .SetProperty(u => u.ImgUrl,  u => customerPutRequest.ImgUrl)
                .SetProperty(u => u.UpdatedAt, u => DateTime.Now)
            );
             

            var newCustomer = await dbContext.Customers.Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
   
            return Ok(newCustomer);

        }
        catch(Exception e){
  
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
     {

        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var userExists = await dbContext.Customers.Select(
            o => new {
                o.Id,
                o.FirstName,
                o.LastName,
                o.Email,
                o.Gender,
                o.BirthDate,
                o.Username,
                o.Active,
                o.IsConfirmed,
                o.ImgUrl,
                o.CreatedAt,
                o.UpdatedAt
            }).FirstOrDefaultAsync(u => u.Id.ToString() == id);

            if(userExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            await dbContext.Customers.Where(u => u.Id.ToString() == id).ExecuteDeleteAsync();

            return Ok(userExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomer(string id)
    {

        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var userExists = await dbContext.Customers.Select(
            o => new {
                o.Id,
                o.FirstName,
                o.LastName,
                o.Email,
                o.Gender,
                o.BirthDate,
                o.Username,
                o.Active,
                o.IsConfirmed,
                o.ImgUrl,
                o.CreatedAt,
                o.UpdatedAt
            }).FirstOrDefaultAsync(u => u.Id.ToString() == id);

            if(userExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(userExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
  
    [HttpGet("GetCustomerByEmail/{email}")]
    public async Task<IActionResult> GetCustomerByEmail([FromRoute] string email)
    {

        try{
         
            if(email == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var userExists = await dbContext.Customers.Select(
            o => new {
                o.Id,
                o.FirstName,
                o.LastName,
                o.Email,
                o.Gender,
                o.BirthDate,
                o.Username,
                o.Active,
                o.IsConfirmed,
                o.ImgUrl,
                o.CreatedAt,
                o.UpdatedAt
            }).FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if(userExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(userExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
  


    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page, [FromQuery] string? search="")
    {

        try{ 
    
            if(search == ""){

                var customers = await dbContext.Customers.OrderBy(c=> c.CreatedAt).Skip((page - 1) * 10).Take(10).Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }
            ).ToListAsync();

            return Ok(new {
                customers,
                count= Math.Ceiling((await dbContext.Customers.CountAsync()) / 10.0)
            });

            }else{
               
                 var customers = await 
                 dbContext.Customers
                 .OrderBy(c=> c.CreatedAt)
                 .Where(c=> c.Email.Trim().ToLower().Contains(search.Trim().ToLower()) )
                 .Skip((page - 1) * 10).Take(10)
                 .Select(
                o => new {
                    o.Id,
                    o.FirstName,
                    o.LastName,
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.Username,
                    o.Active,
                    o.IsConfirmed,
                    o.ImgUrl,
                    o.CreatedAt,
                    o.UpdatedAt
                }
            ).ToListAsync();

            return Ok(new {
                customers,
                count= Math.Ceiling((await dbContext.Customers.Where(c=> c.Email.Trim().ToLower().Contains(search.Trim().ToLower()) ).CountAsync()) / 10.0)
            });
            }
            
        }
        catch(Exception e){
            System.Console.WriteLine(e);
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
   
    [HttpPost("login")]
    public async Task<IActionResult> Post([FromBody] CustomerLoginRequest customerLoginRequest)
    {
      
        try{
            
            var userExists = await dbContext.Customers.FirstOrDefaultAsync(u => u.Email == customerLoginRequest.Email);

            if(userExists == null){
                
                return BadRequest(ApplicationError.notFound);
            }

            if(!BCrypt.Net.BCrypt.Verify(customerLoginRequest.Password,userExists.Password,false,BCrypt.Net.HashType.SHA384))
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(new
            {
        
                userExists.Id,
                userExists.FirstName,
                userExists.LastName,
                userExists.Email,
                userExists.Gender,
                userExists.BirthDate,
                userExists.Username,
                userExists.Active,
                userExists.IsConfirmed,
                userExists.CreatedAt,
                userExists.UpdatedAt

            });

        }catch(Exception e){
           _logger.LogError(e.Message);     
           return BadRequest(ApplicationError.appError);
        }

    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CustomerRequest customerRequest)
    {
         
        try{
            
            var userExists = await dbContext.Customers
            .FirstOrDefaultAsync( u=> u.Username == customerRequest.Username || u.Email == customerRequest.Email );

            if(userExists != null){

                return BadRequest(ApplicationError.userExists);
            }

         
            dbContext.Add( new Customer{
                FirstName=customerRequest.FirstName.ToLower(),
                LastName=customerRequest.LastName.ToLower(),
                Email=customerRequest.Email.ToLower(),
                IsConfirmed=false,
                Password=BCrypt.Net.BCrypt.HashPassword(customerRequest.Password),
                Active=true,
                BirthDate=DateOnly.FromDateTime(DateTime.Parse(customerRequest.BirthDate)),
                Username=customerRequest.Username,
                Gender=customerRequest.Gender
            });
   

            await dbContext.SaveChangesAsync();
             
            var customer = await dbContext.Customers.OrderBy(c=>c.CreatedAt).Select(
            o => new {
                o.Id,
                o.FirstName,
                o.LastName,
                o.Email,
                o.Gender,
                o.BirthDate,
                o.Username,
                o.Active,
                o.IsConfirmed,
                o.ImgUrl,
                o.CreatedAt,
                o.UpdatedAt
            }).LastAsync();

            return Ok(customer);

        }catch(Exception e){
           _logger.LogError(e.Message);     
           return BadRequest(ApplicationError.appError);
        }

    }
}

