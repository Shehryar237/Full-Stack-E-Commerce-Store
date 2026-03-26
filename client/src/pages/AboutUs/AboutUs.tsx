// src/pages/About/About.tsx
import React from 'react';
import { Container, Title, Text, Grid, Paper} from '@mantine/core';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import NavBar from '../../components/layout/NavBar/NavBar';
import styles from './AboutUs.module.css';
import { useNavigate } from 'react-router-dom'; 

export default function AboutUs() {
        const navigate = useNavigate(); 

    return (
        <>
            <NavBar />
            <div className={styles.wrapper}>
                <Container size="lg">
                    {/* Hero Section */}
                    <section className={styles.hero}>
                    <Title order={1} className={styles.heroTitle}>
                        About <span className={styles.brand}>Our Store</span>
                    </Title>
                    <Text className={styles.heroSubtitle}>
                        We believe shopping should be easy, exciting, and inspiring.
                    </Text>
                    </section>

                    <Divider />

                    {/* Mission Section */}
                    <section className={styles.mission}>
                    <Grid gutter="xl" align="center">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                        <Image
                            src="/images/storeLogo.png"
                            alt="Storefront"
                            preview
                            className={styles.logoImage}
                        />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                        <Title order={2} className={styles.sectionTitle}>
                            Our Mission
                        </Title>
                        <Text className={styles.sectionText}>
                            Our mission is to provide customers with top-quality products at fair
                            prices, while delivering an unmatched shopping experience. We work
                            with trusted suppliers and constantly innovate to bring you the best
                            selection possible.
                        </Text>
                        <Button
                            label="Shop Now"
                            icon="pi pi-shopping-bag"
                            className={styles.ctaButton}
                            onClick={() =>navigate('/products')}
                        />
                        </Grid.Col>
                    </Grid>
                    </section>

                    <Divider />

                    {/* Team Section */}
                    <section className={styles.team}>
                        <Container size="lg">
                            <Title order={2} className={styles.sectionHeading}>
                                Meet Our Team
                            </Title>
                            <Grid gutter="lg">
                                {[
                                    { name: 'Alice', role: 'CEO', img: '/images/placeHolderStaff.png' },
                                    { name: 'Bob', role: 'Head of Marketing', img: '/images/placeHolderStaff.png' },
                                    { name: 'Charlie', role: 'Lead Developer', img: '/images/placeHolderStaff.png' },
                                ].map((member) => (
                                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={member.name}>
                                        <Card className={styles.teamCard}>
                                            <Image
                                                src={member.img}
                                                alt={member.name}
                                                className={styles.teamImage}
                                            />
                                            <div className={styles.teamMemberInfo}>
                                                <Text fw={700} size="lg" className={styles.teamName}>{member.name}</Text>
                                                <Text className={styles.teamRole}>{member.role}</Text>
                                            </div>
                                            
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Container>
                    </section>

                    <Divider />

                    {/* Values Section */}
                    <section className={styles.values}>
                    <Title order={2} className={styles.sectionHeading}>
                        Our Core Values
                    </Title>
                    <Grid gutter="lg">
                        {[
                        {
                            title: 'Quality',
                            desc: 'Only the best products, carefully curated for you.',
                            icon: 'pi pi-star',
                        },
                        {
                            title: 'Trust',
                            desc: 'We prioritize honesty, transparency, and reliability.',
                            icon: 'pi pi-shield',
                        },
                        {
                            title: 'Innovation',
                            desc: 'Always pushing forward with new ideas and solutions.',
                            icon: 'pi pi-lightbulb',
                        },
                        ].map((val) => (
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={val.title}>
                            <Paper className={styles.valueCard}>
                            <i className={`${val.icon} ${styles.valueIcon}`} />
                            <Title order={4} className={styles.valueTitle}>
                                {val.title}
                            </Title>
                            <Text className={styles.valueText}>{val.desc}</Text>
                            </Paper>
                        </Grid.Col>
                        ))}
                    </Grid>
                    </section>
                </Container>
            </div>
        </>
    );
}
