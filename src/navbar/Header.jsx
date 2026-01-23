function Header() {
  return (
    <>
    <div className="flex justify-between px-10 py-5 border-b items-center">
        <h1 className="text-xl">O Dental Clinic</h1>
        <div>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </div>
    </>
  )
}

export default Header