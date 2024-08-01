import React from 'react';
import { AppBar, Box, Grid, Typography, Link, IconButton, Container } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

function Footer() {
  return (
    <AppBar position="static" component="footer" sx={{ backgroundColor: 'black', color: '#fff' }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Get connected with us on social networks:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton color="inherit" href="https://www.facebook.com" target="_blank"><FacebookIcon /></IconButton>
            <IconButton color="inherit" href="https://www.twitter.com" target="_blank"><TwitterIcon /></IconButton>
            <IconButton color="inherit" href="https://www.instagram.com" target="_blank"><InstagramIcon /></IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6" gutterBottom>SOCIAL360</Typography>
              <Typography variant="body2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem fugit, dolor similique magni quas voluptate obcaecati voluptatum debitis laboriosam eveniet dolorem accusamus quo mollitia voluptates minus? Odio nam labore officiis!
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6" gutterBottom>SERVICES</Typography>
              <Link href="#" color="inherit">Events</Link><br />
              <Link href="#" color="inherit">MDWordPress</Link><br />
              <Link href="#" color="inherit">BrandFlow</Link><br />
              <Link href="#" color="inherit">Bootstrap Angular</Link>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6" gutterBottom>USEFUL LINKS</Typography>
              <Link href="#" color="inherit">Your Account</Link><br />
              <Link href="#" color="inherit">Become an Affiliate</Link><br />
              <Link href="#" color="inherit">Shipping Rates</Link><br />
              <Link href="#" color="inherit">Help</Link>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h6" gutterBottom>CONTACT</Typography>
              <Typography variant="body2">Address123</Typography>
              <Typography variant="body2">Social360@example.com</Typography>
              <Typography variant="body2">+01 234 567 88</Typography>
              <Typography variant="body2">+01 234 567 89</Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="body2" align="center" sx={{ py: 1 }}>
          © 2020 Copyright: Social360
        </Typography>
      </Container>
    </AppBar>
  );
}

export default Footer;
