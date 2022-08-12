/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Render('index')
    index() {
        return {
            title: 'Home Page - Online Store',
        };
    }

    @Get('about')
    @Render('about')
    about() {
        const viewData = {
            description: 'This is an about page ...',
            author: 'Developed by: Ljubomir Matovic',
        };
        return {
            title: 'About us - Online Store',
            subtitle: 'About us',
            viewData,
        };
    }
}
